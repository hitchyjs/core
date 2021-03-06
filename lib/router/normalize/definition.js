/**
 * (c) 2017 cepharum GmbH, Berlin, http://cepharum.de
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 cepharum GmbH
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

const Route = require( "../types/route" ).Route;


/**
 * Normalizes provided set of routing definitions.
 *
 * @type {{Plugin:HitchyRouteNormalizer, Custom:HitchyRouteNormalizer, Blueprint:HitchyRouteNormalizer}}
 */
module.exports = {
	Plugin: _normalizeDefinition.bind( {}, true, false ),
	Custom: _normalizeDefinition.bind( {}, true, true ),
	Blueprint: _normalizeDefinition.bind( {}, false, false ),
};

/**
 * @typedef {function( rawDefinition:(HitchyRoutepluginTables|HitchyRouteDescriptorSet) ):HitchyRoutePluginTablesNormalized} HitchyRouteNormalizer
 */

/**
 * Commonly implements normalization of routing definitions.
 *
 * @param {boolean} supportAnyStage true to support any stage in raw definition
 * @param {boolean} supportAllStages true to support stages "early" and "late"
 *        as used with custom routes of current application
 * @param {object} rawDefinition raw definition of routings to be normalized
 * @returns {HitchyRoutePluginTablesNormalized|HitchyRouteDescriptorSet} normalized routing definitions
 * @private
 */
function _normalizeDefinition( supportAnyStage, supportAllStages, rawDefinition ) {
	switch ( typeof rawDefinition ) {
		case "object" :
			if ( rawDefinition ) {
				if ( !Array.isArray( rawDefinition ) ) {
					let unexpectedStages = false;
					let explicit = Boolean( supportAnyStage );
					let foundExplicit = false;
					let toCheck = 5;

					if ( explicit ) {
						for ( const name in rawDefinition ) {
							if ( rawDefinition.hasOwnProperty( name ) ) {
								// eslint-disable-next-line max-depth
								if ( toCheck-- < 1 ) {
									break;
								}

								// eslint-disable-next-line max-depth
								switch ( name ) {
									case "early" :
									case "late" :
										foundExplicit = true;

										// eslint-disable-next-line max-depth
										if ( !supportAllStages ) {
											unexpectedStages = true;
										}
										break;

									case "before" :
									case "after" :
										foundExplicit = true;
										break;

									default :
										explicit = false;
								}
							}
						}

						if ( foundExplicit && !explicit ) {
							// simple routing declarations are mixed with subordinated
							// sets of declarations for particular routing slot
							throw new TypeError( "invalid mix of routing definitions with and without routing slot selection" );
						}
					}

					if ( !explicit ) {
						// at least one property does not use name matching any
						// known stage -> consider whole definition as implicit
						break;
					}

					if ( unexpectedStages ) {
						// all properties of definition match names of known stages,
						// but some of the stages are not expected thus throw
						// exception to notify user (to support in debugging)
						throw new TypeError( "got one or more unexpected stages in route definition" );
					}


					/*
					 * create new object containing all expected stages
					 * optionally using empty definition if provided one
					 * is lacking of it
					 */
					let result;

					if ( supportAllStages ) {
						result = { early: new Map(), before: new Map(), after: new Map(), late: new Map() };
					} else {
						result = { before: new Map(), after: new Map() };
					}

					for ( const name in result ) {
						if ( result.hasOwnProperty( name ) ) {
							if ( rawDefinition.hasOwnProperty( name ) ) {
								result[name] = _normalizeSet( rawDefinition[name] );
							}
						}
					}

					return result;
				}
			}
			break;

		case "undefined" :
			break;

		default :
			throw new TypeError( `invalid route definition: ${rawDefinition}` );
	}

	return supportAnyStage ? supportAllStages ? {
		early: new Map(),
		before: _normalizeSet( rawDefinition || {} ),
		after: new Map(),
		late: new Map()
	} : {
		before: _normalizeSet( rawDefinition || {} ),
		after: new Map()
	} : _normalizeSet( rawDefinition || {} );
}

/**
 * Normalizes single set of routes provided as object, array or map.
 *
 * @param {Array|object|Map} rawSetOfRoutes raw set of routes to be normalized
 * @returns {Map} normalized routing definitions grouped by their source
 * @private
 */
function _normalizeSet( rawSetOfRoutes ) {
	if ( !rawSetOfRoutes ) {
		return new Map();
	}

	if ( rawSetOfRoutes instanceof Map ) {
		return rawSetOfRoutes;
	}

	if ( Array.isArray( rawSetOfRoutes ) ) {
		// create Map from provided array
		const mapping = new Map();

		for ( let i = 0, length = rawSetOfRoutes.length; i < length; i++ ) {
			let source, target;
			const route = rawSetOfRoutes[i];

			if ( Array.isArray( route ) ) {
				if ( route.length === 2 ) {
					[ source, target ] = route;
				} else {
					throw new TypeError( "invalid array-based definition of a route" );
				}
			} else {
				const _source = Route.preparseSource( route );

				source = `${_source.type} ${_source.url}`;
				target = route;
			}

			if ( mapping.has( source ) ) {
				const existing = mapping.get( source );

				if ( Array.isArray( source ) ) {
					existing.push( target );
				} else {
					mapping.set( source, [ existing, target ] );
				}
			} else {
				mapping.set( source, target );
			}
		}

		return mapping;
	}

	if ( typeof rawSetOfRoutes === "object" ) {
		const mapping = new Map();

		for ( const name in rawSetOfRoutes ) {
			if ( rawSetOfRoutes.hasOwnProperty( name ) ) {
				const source = Route.preparseSource( name );

				mapping.set( `${source.type} ${source.exact ? "=" : ""}${source.prefix ? "~" : ""}${source.url}`, rawSetOfRoutes[name] );
			}
		}

		return mapping;
	}

	throw new TypeError( "invalid list of raw routing definitions" );
}
