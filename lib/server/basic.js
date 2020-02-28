/**
 * (c) 2020 cepharum GmbH, Berlin, http://cepharum.de
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 cepharum GmbH
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @author: cepharum
 */

"use strict";

const File = require( "fs" );

const Log = require( "debug" )( "hitchy:start" );
const Debug = require( "debug" )( "hitchy:debug" );

/**
 * Implements basic version of internal server for exposing hitchy-based
 * application.
 *
 * @param {HitchyOptions} options global options customizing Hitchy
 * @param {HitchyCLIArguments} args arguments passed for processing in context of start action
 * @param {function} onShutdown callback invoked after having shut down server
 * @returns {Promise<{server:Server, hitchy:HitchyInstance}>} promises server started
 */
module.exports = function basicServer( options, args, onShutdown ) {
	Log( `starting application using internal server ...` );

	const port = args.port || process.env.PORT || 3000;
	const addr = args.ip || process.env.IP || "127.0.0.1";

	let startedServer = null;
	let startedHitchy = null;

	return createServerAndHitchyInstance()
		.then( ( { server, hitchy } ) => {
			startedServer = server;
			startedHitchy = hitchy;

			server.once( "error", error => {
				console.error( `server failed: ${error.message}` );

				process.exitCode = 2;
				stopRequestListener();
			} );

			server.once( "close", stopHitchy );

			const serverRequestTimeout = parseInt( args.timeout || process.env.HITCHY_TIMEOUT );
			if ( serverRequestTimeout > 0 ) {
				server.setTimeout( serverRequestTimeout );
			}

			const prepared = hitchy.onStarted
				.then( () => {
					hitchy.api.once( "shutdown", () => {
						stopRequestListener();
					} );

					hitchy.api.once( "crash", cause => {
						console.error( `FATAL: Hitchy has crashed: ${cause.stack}` );

						process.exitCode = 4;
						stopRequestListener();
					} );

					server.on( "request", hitchy );

					if ( !args.quiet ) {
						console.error( `Hitchy service has been prepared.` );
					}

					server.listen( port, addr, process.env.BACKLOG || 10240 );

					return new Promise( ( resolve, reject ) => {
						server.once( "error", reject );
						server.once( "listening", () => {
							if ( !args.quiet ) {
								console.error( `Hitchy is listening for requests at ${compileUrl( server )}, now.` );
							}

							resolve();
						} );
					} );
				} )
				.catch( error => {
					console.error( `Starting Hitchy failed: ${error.stack}` );

					process.exitCode = 3;
					stopRequestListener();
				} );

			// handle request for shutting down service either by pressing
			// Ctrl+C with server running in foreground or by sending
			// SIGINT/SIGTERM signal
			server.on( "connection", trackActiveConnection );

			process.on( "SIGINT", stopRequestListener );
			process.on( "SIGTERM", stopRequestListener );

			return prepared.then( () => ( { server, hitchy } ) );
		} )
		.catch( error => {
			console.error( error );

			process.exitCode = 1;

			if ( startedServer || startedHitchy ) {
				stopRequestListener();
			}
		} );

	/**
	 * Creates server listening for requests to be processed by hitchy instance
	 * created and injected into that server, too.
	 *
	 * @returns {Promise<{server:Server, hitchy:HitchyInstance}>} promises listening server and hitchy instance bound to it
	 */
	function createServerAndHitchyInstance() {
		switch ( args.injector || "" ) {
			case "node" :
			case "" :
				return getHttpServer().then( server => {
					const hitchy = require( "../../injector" ).node( options );

					return { server, hitchy };
				} );

			case "express" :
			case "connect" :
				return new Promise( resolve => {
					const server = require( "express" )();
					const hitchy = require( "../../injector" ).express( options );

					server.use( hitchy );

					resolve( { server, hitchy } );
				} );

			default :
				return Promise.reject( new Error( `unknown injector: ${args.injector}` ) );
		}
	}

	/**
	 * Creates HTTP server instance depending on provided arguments optionally
	 * providing SSL key and certificates for running hitchy via HTTPS.
	 *
	 * @return {Promise<Server>} promises created HTTP(S) server instance
	 */
	function getHttpServer() {
		const { sslKey, sslCert, sslCaCert } = args;

		if ( sslKey && sslCert ) {
			return Promise.all( [
				readFile( sslKey ),
				readFile( sslCert ),
				sslCaCert ? readFile( sslCaCert ) : Promise.resolve( null ),
			] )
				.catch( error => {
					throw new Error( `reading one or more SSL file(s) failed: ${error.message}` );
				} )
				.then( ( [ key, cert, ca ] ) => Object.assign( require( "https" ).createServer( {
					key, cert, ca,
				} ), { isHttps: true } ) );
		}

		if ( sslKey || sslCert ) {
			return Promise.reject( new Error( "incomplete SSL configuration: provide filenames of key AND cert" ) );
		}

		return Promise.resolve( Object.assign( require( "http" ).createServer(), { isHttps: false } ) );
	}

	/**
	 * Reads content of file selected by its name.
	 *
	 * @param {string} fileName name of file to read
	 * @return {Promise<Buffer>} selected file's content
	 */
	function readFile( fileName ) {
		return new Promise( ( resolve, reject ) => {
			File.readFile( fileName, ( error, content ) => {
				if ( error ) {
					reject( error );
				} else {
					resolve( content );
				}
			} );
		} );
	}

	/**
	 * Compiles URL provided server instance is available at.
	 *
	 * @param {Server} server server instance
	 * @returns {string} URL of provided server
	 */
	function compileUrl( server ) {
		const serverAddress = server.address();
		let serverPort = serverAddress.port, scheme;

		switch ( serverPort ) {
			case "80" :
				scheme = "http://";
				serverPort = "";
				break;

			case "443" :
				scheme = "https://";
				serverPort = "";
				break;

			default :
				scheme = server.isHttps ? "https://" : "http://";
				serverPort = ":" + serverPort;
		}

		return scheme + serverAddress.address + serverPort;
	}

	/**
	 * Tracks connections established with running service.
	 *
	 * @param {Socket} socket new incoming client connection
	 * @returns {void}
	 * @private
	 */
	function trackActiveConnection( socket ) {
		if ( !startedServer ) {
			return;
		}

		if ( startedServer.$stoppingServer ) {
			socket.destroy( new Error( "server is shutting down" ) );
			return;
		}

		if ( !Array.isArray( startedServer.$trackedSockets ) ) {
			startedServer.$trackedSockets = [];
		}

		if ( options.debug ) {
			Debug( `new connection from ${socket.remoteAddress}:${socket.remotePort}` );
		}

		startedServer.$trackedSockets.push( socket );

		// keep track of closing connection established now
		socket.once( "close", () => {
			if ( options.debug ) {
				Debug( `closed connection from ${socket.remoteAddress}:${socket.remotePort}` );
			}

			const sockets = startedServer.$trackedSockets;
			const numSockets = sockets.length;

			for ( let i = 0; i < numSockets; i++ ) {
				if ( sockets[i] === socket ) {
					sockets.splice( i, 1 );
					break;
				}
			}
		} );
	}

	/**
	 * Handles stage #1 of shutting down service by stopping request listener.
	 *
	 * This method is reducing timeout on all active connections to shut down
	 * service more instantly. Eventually it is triggering stage #2 ...
	 *
	 * @returns {void}
	 * @private
	 */
	function stopRequestListener() {
		if ( startedServer && !startedServer.$stoppingServer ) {
			startedServer.$stoppingServer = true;

			Log( "shutting down request listener ... " );

			// disable keep-alives and reduce timeout on all active connections
			const s = startedServer.$trackedSockets;

			if ( Array.isArray( s ) ) {
				const numSockets = s.length;

				for ( let i = 0; i < numSockets; i++ ) {
					s[i].setKeepAlive( false );
					s[i].setTimeout( 1000 );
				}
			}

			if ( startedServer.listening ) {
				// shutdown server's listener first
				startedServer.close();

				// don't stop Hitchy unless request listener has been shut down
				return;
			}
		}

		stopHitchy();
	}

	/**
	 * Gracefully shuts down probably started hitchy instance.
	 *
	 * @returns {void}
	 */
	function stopHitchy() {
		if ( startedHitchy ) {
			Log( "shutting down Hitchy ..." );

			startedHitchy.stop()
				.finally( () => { process.nextTick( onShutdown ); } )
				.catch( error => {
					console.error( "error on shutting down hitchy: %s", error.stack );
				} );
		} else {
			process.nextTick( onShutdown );
		}
	}
};