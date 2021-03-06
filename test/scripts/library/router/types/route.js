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
 * @author cepharum
 */

"use strict";

const apiOverlay = {
	runtime: {
		controllers: {
			Custom: class CustomController {
				static myHandler( req, res ) {} // eslint-disable-line no-unused-vars, require-jsdoc
			}
		},
		policies: {
			Filter: class FilterPolicy {
				static myImplementation( req, res, next ) {} // eslint-disable-line no-unused-vars, require-jsdoc
			}
		},
	}
};

const modules = {
	RouterModule: "lib/router",
	TypesModule: "lib/router/types",
	RouteModule: "lib/router/types/route",
};

const { describe, it } = require( "mocha" );

const Should = require( "should" );
require( "should-http" );

const ApiMockUp = require( "../../../../../tools" ).apiMockUp( { apiOverlay, modules } );

// ----------------------------------------------------------------------------

describe( "Library.Router.Types.Route", function() {
	it( "is exposed properly", function() {
		return ApiMockUp.then( function( { RouterModule, TypesModule, RouteModule } ) {
			Should.exist( RouterModule );
			Should.exist( RouterModule.types );
			Should.exist( RouterModule.types.route );

			Should.exist( TypesModule );
			Should.exist( TypesModule.route );

			RouterModule.types.should.equal( TypesModule );
			TypesModule.route.should.equal( RouteModule );

			Should.exist( RouteModule.Route );
			Should.exist( RouteModule.PolicyRoute );
			Should.exist( RouteModule.TerminalRoute );
		} );
	} );
} );

describe( "Library.Router.Types.Route#Route", function() {
	it( "exists", function() {
		return ApiMockUp.then( function( { RouteModule } ) {
			RouteModule.Route.should.be.ok().and.should.be.Object();
		} );
	} );

	it( "can be instantiated", function() {
		return ApiMockUp.then( function( { API, RouteModule } ) {
			( () => { new RouteModule.Route( "/", () => {}, API ); } ).should.not.throw();
		} );
	} );

	it( "provides static method for parsing routing source definitions", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			Route.parseSource.should.be.Function();
		} );
	} );

	it( "provides static method for parsing routing target definitions", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			Route.parseTarget.should.be.Function();
		} );
	} );

	it( "exposes pattern for matching and normalizing names of components containing route targets", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			Route.tailPattern.should.be.instanceof( RegExp );

			"SomeCustomController".replace( Route.tailPattern, "" ).should.equal( "SomeCustom" );
			"SomeCustomPolicy".replace( Route.tailPattern, "" ).should.equal( "SomeCustomPolicy" );
		} );
	} );

	it( "exposes singular name of collection to contain code addressable by routes", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			Route.collectionSingularName.should.be.String();
			Route.collectionSingularName.should.be.empty();
		} );
	} );

	it( "exposes plural name of collection to contain code addressable by routes", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			Route.collectionPluralName.should.be.String();
			Route.collectionPluralName.should.be.empty();
		} );
	} );
} );

describe( "Library.Router.Types.Route#PolicyRoute", function() {
	it( "can be instantiated", function() {
		return ApiMockUp.then( function( { API, RouteModule: { PolicyRoute } } ) {
			( () => { new PolicyRoute( "/", () => {}, API ); } ).should.not.throw();
		} );
	} );

	it( "is class inheriting from Route", function() {
		return ApiMockUp.then( function( { API, RouteModule: { PolicyRoute, Route } } ) {
			const route = new PolicyRoute( "/", () => {}, API );
			route.should.be.instanceof( PolicyRoute );
			route.should.be.instanceof( Route );
		} );
	} );

	it( "does not use custom parser function", function() {
		return ApiMockUp.then( function( { RouteModule: { PolicyRoute, Route } } ) {
			PolicyRoute.parseSource.should.be.equal( Route.parseSource );
			PolicyRoute.parseTarget.should.be.equal( Route.parseTarget );
		} );
	} );

	it( "exposes pattern for matching and normalizing names of components containing route targets", function() {
		return ApiMockUp.then( function( { RouteModule: { PolicyRoute } } ) {
			PolicyRoute.tailPattern.should.be.instanceof( RegExp );

			"SomeCustomController".replace( PolicyRoute.tailPattern, "" ).should.equal( "SomeCustomController" );
			"SomeCustomPolicy".replace( PolicyRoute.tailPattern, "" ).should.equal( "SomeCustom" );
		} );
	} );

	it( "exposes singular name of collection to contain code addressable by routes", function() {
		return ApiMockUp.then( function( { RouteModule: { PolicyRoute } } ) {
			PolicyRoute.collectionSingularName.should.be.String();
			PolicyRoute.collectionSingularName.should.equal( "policy" );
		} );
	} );

	it( "exposes plural name of collection to contain code addressable by routes", function() {
		return ApiMockUp.then( function( { RouteModule: { PolicyRoute } } ) {
			PolicyRoute.collectionPluralName.should.be.String();
			PolicyRoute.collectionPluralName.should.equal( "policies" );
		} );
	} );
} );

describe( "Library.Router.Types.Route#TerminalRoute", function() {
	it( "can be instantiated", function() {
		return ApiMockUp.then( function( { API, RouteModule: { TerminalRoute } } ) {
			( () => { new TerminalRoute( "/", () => {}, API ); } ).should.not.throw();
		} );
	} );

	it( "is class inheriting from Route", function() {
		return ApiMockUp.then( function( { API, RouteModule: { TerminalRoute, Route } } ) {
			const route = new TerminalRoute( "/", () => {}, API );
			route.should.be.instanceof( TerminalRoute );
			route.should.be.instanceof( Route );
		} );
	} );

	it( "does not use custom parser function", function() {
		return ApiMockUp.then( function( { RouteModule: { TerminalRoute, Route } } ) {
			TerminalRoute.parseSource.should.be.equal( Route.parseSource );
			TerminalRoute.parseTarget.should.be.equal( Route.parseTarget );
		} );
	} );

	it( "exposes pattern for matching and normalizing names of components containing route targets", function() {
		return ApiMockUp.then( function( { RouteModule: { TerminalRoute } } ) {
			TerminalRoute.tailPattern.should.be.instanceof( RegExp );

			"SomeCustomController".replace( TerminalRoute.tailPattern, "" ).should.equal( "SomeCustom" );
			"SomeCustomPolicy".replace( TerminalRoute.tailPattern, "" ).should.equal( "SomeCustomPolicy" );
		} );
	} );

	it( "exposes singular name of collection to contain code addressable by routes", function() {
		return ApiMockUp.then( function( { RouteModule: { TerminalRoute } } ) {
			TerminalRoute.collectionSingularName.should.be.String();
			TerminalRoute.collectionSingularName.should.equal( "controller" );
		} );
	} );

	it( "exposes plural name of collection to contain code addressable by routes", function() {
		return ApiMockUp.then( function( { RouteModule: { TerminalRoute } } ) {
			TerminalRoute.collectionPluralName.should.be.String();
			TerminalRoute.collectionPluralName.should.equal( "controllers" );
		} );
	} );
} );

describe( "Library.Router.Types.Route.Route#parseSource", function() {
	it( "rejects invalid types of values for defining source of routing", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			Route.parseSource.bind( Route ).should.throw();
			Route.parseSource.bind( Route, null ).should.throw();
			Route.parseSource.bind( Route, undefined ).should.throw();
			Route.parseSource.bind( Route, false ).should.throw();
			Route.parseSource.bind( Route, true ).should.throw();
			Route.parseSource.bind( Route, 1.0 ).should.throw();
			Route.parseSource.bind( Route, -0.0 ).should.throw();
			Route.parseSource.bind( Route, [] ).should.throw();
			Route.parseSource.bind( Route, [ "GET", "/" ] ).should.throw();
		} );
	} );

	it( "accepts well-formed strings for defining source of routing", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			Route.parseSource.bind( Route, "" ).should.throw();

			Route.parseSource.bind( Route, "/" ).should.not.throw();
			Route.parseSource.bind( Route, "GET /" ).should.not.throw();
		} );
	} );

	it( "accepts objects containing certaing properties for defining source of routing", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			Route.parseSource.bind( Route, {} ).should.throw();
			Route.parseSource.bind( Route, { method: "GET", path: "/" } ).should.throw();

			Route.parseSource.bind( Route, { url: "/" } ).should.not.throw();
			Route.parseSource.bind( Route, { type: "GET", url: "/" } ).should.not.throw();
			Route.parseSource.bind( Route, { type: "GET", url: "/", module: "MyController", method: "listItems" } ).should.not.throw();
		} );
	} );

	it( "provides all information on parsed source of defined route", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			const source = Route.parseSource( "/" );

			Should.exist( source );
			source.should.have.keys( "method", "definition", "prefix", "pattern", "parameters", "render" ).and.have.size( 6 );

			source.method.should.be.String();
			source.prefix.should.be.String();
			source.pattern.should.be.instanceof( RegExp );
			source.parameters.should.be.Array();
			source.render.should.be.Function();
		} );
	} );

	it( "provides uppercase name of HTTP method route is bound to", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			const tests = {
				"/": "ALL",
				"get /": "GET",
				"GET /": "GET",
				"put /": "PUT",
				"puT /": "PUT",
				"anyThing /": "ANYTHING",
				"ANYTHING /": "ANYTHING",
				"some-tYPE /": "SOME-TYPE",
				"SOME-type /": "SOME-TYPE",
				"* /": "ALL",
			};

			Object.keys( tests ).forEach( source => {
				const route = Route.parseSource( source );
				route.method.should.equal( tests[source] );
			} );
		} );
	} );

	it( "maps defined HTTP method * to ALL", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			const tests = {
				"* /": "ALL",
				"all /": "ALL",
				"ALL /": "ALL",
				"ALLe /": "ALLE",
				"any /": "ANY",
			};

			Object.keys( tests ).forEach( source => {
				const route = Route.parseSource( source );
				route.method.should.equal( tests[source] );
			} );
		} );
	} );

	it( "rejects definitions declaring invalid HTTP method", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			const tests = [ "+", "-", ".", "1", "23", "A1", "ANY_TYPE", "-LESS" ];

			tests.forEach( method => {
				Route.parseSource.bind( Route, method + " /" ).should.throw();
			} );
		} );
	} );

	it( "accepts valid pathes", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			const pathes = [
				// w/o parameters
				"/", "/test", "/test/", "/test/more", "/a", "/a/b",
				// w/ parameters
				"/:test", "/prefix/:rest", "/(optional)?", "/(repeatable)*", "/(repeatable)+",
				"/:test/(optional)?", "/:test/(repeatable)*", "/:test/(repeatable)+",
				"/prefix/:rest/(optional)?", "/prefix/:rest/(repeatable)*", "/prefix/:rest/(repeatable)+",
				"/prefix/:rest/(optional)?/suffix", "/prefix/:rest/(repeatable)*/suffix", "/prefix/:rest/(repeatable)+/suffix",
				"/prefix/:rest/(optional)?/suffix/:arg", "/prefix/:rest/(repeatable)*/suffix/:arg", "/prefix/:rest/(repeatable)+/suffix/:arg",
			];

			pathes.forEach( path => Route.parseSource.bind( Route, path ).should.not.throw() );
		} );
	} );

	it( "rejects invalid pathes", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			const pathes = [
				// w/o parameters and globbing
				"", ".", "..", "../", "./test", "test", ".//", "//more", "/test//more", "/test/more//",
				// w/ invalid parameters
				":", "/:", "/:/",
				// w/ invalid globbing
				"/()", "/()?", "/()*", "/()+"
			];

			pathes.forEach( path => Route.parseSource.bind( Route, path ).should.throw() );
		} );
	} );

	it( "extract static prefix from route's declared path", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			Route.parseSource( "/" ).prefix.should.equal( "/" );
			Route.parseSource( "/test" ).prefix.should.equal( "/test" );
			Route.parseSource( "/test/" ).prefix.should.equal( "/test" );
			Route.parseSource( "/test/more" ).prefix.should.equal( "/test/more" );
			Route.parseSource( "/test/more/" ).prefix.should.equal( "/test/more" );

			Route.parseSource( "/test/more/:name" ).prefix.should.equal( "/test/more" );
			Route.parseSource( "/test/(more)" ).prefix.should.equal( "/test" );
			Route.parseSource( "/tes(t)?/(more)" ).prefix.should.equal( "/tes" );
			Route.parseSource( "/test(more)" ).prefix.should.equal( "/test" );
		} );
	} );

	it( "extracts ordered list of parameter names used in path declaration", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			Route.parseSource( "/" ).parameters.should.have.length( 0 );
			Route.parseSource( "/test" ).parameters.should.have.length( 0 );
			Route.parseSource( "/test/" ).parameters.should.have.length( 0 );
			Route.parseSource( "/test/more" ).parameters.should.have.length( 0 );

			let parameters = Route.parseSource( "/test/more/:var" ).parameters;
			parameters.should.have.length( 1 );
			parameters[0].should.have.properties( "name", "prefix", "modifier", "pattern" );
			parameters[0].name.should.equal( "var" );
			parameters[0].prefix.should.equal( "/" );
			parameters[0].modifier.should.be.empty();
			( () => { new RegExp( parameters[0].pattern ); } ).should.not.throw();

			parameters = Route.parseSource( "/test/:more/extra\\-:var" ).parameters;
			parameters.should.have.length( 2 );
			parameters[0].should.have.properties( "name", "prefix", "modifier", "pattern" );
			parameters[0].name.should.equal( "more" );
			parameters[0].prefix.should.equal( "/" );
			parameters[0].modifier.should.be.empty();
			( () => { new RegExp( parameters[0].pattern ); } ).should.not.throw();

			parameters[1].should.have.properties( "name", "prefix", "modifier", "pattern" );
			parameters[1].name.should.equal( "var" );
			parameters[1].prefix.should.equal( "" );
			parameters[1].modifier.should.be.empty();
			( () => { new RegExp( parameters[1].pattern ); } ).should.not.throw();
		} );
	} );

	it( "extracts ordered list positional parameters defined as sub-matches in path declaration", function() {
		return ApiMockUp.then( function( { RouteModule: { Route } } ) {
			let parameters = Route.parseSource( "/test/more/(var)" ).parameters;
			parameters.should.have.length( 1 );
			parameters[0].should.have.properties( "name", "prefix", "modifier", "pattern" );
			parameters[0].name.should.equal( 0 );
			parameters[0].prefix.should.equal( "/" );
			parameters[0].modifier.should.be.empty();
			( () => { new RegExp( parameters[0].pattern ); } ).should.not.throw();
			parameters[0].pattern.should.equal( "var" );    // for matching `var` as "value", only

			parameters = Route.parseSource( "/test/(more)*/extra\\-(var|name)" ).parameters;
			parameters.should.have.length( 2 );
			parameters[0].should.have.properties( "name", "prefix", "modifier", "pattern" );
			parameters[0].name.should.equal( 0 );
			parameters[0].prefix.should.equal( "/" );
			parameters[0].modifier.should.be.equal( "*" );
			( () => { new RegExp( parameters[0].pattern ); } ).should.not.throw();

			parameters[1].should.have.properties( "name", "prefix", "modifier", "pattern" );
			parameters[1].name.should.equal( 1 );
			parameters[1].prefix.should.equal( "" );
			parameters[1].modifier.should.be.empty();
			( () => { new RegExp( parameters[1].pattern ); } ).should.not.throw();
			parameters[1].pattern.should.equal( "var|name" );
		} );
	} );
} );

describe( "Library.Router.Types.Route.Route#parseTarget", function() {
	it( "rejects any target definition w/o API as context of route", function() {
		return ApiMockUp.then( function( { RouteModule: { PolicyRoute, Route } } ) {
			Route.parseTarget.bind( Route ).should.throw();
			Route.parseTarget.bind( Route, null ).should.throw();
			Route.parseTarget.bind( Route, undefined ).should.throw();
			Route.parseTarget.bind( Route, false ).should.throw();
			Route.parseTarget.bind( Route, true ).should.throw();
			Route.parseTarget.bind( Route, 1.0 ).should.throw();
			Route.parseTarget.bind( Route, -0.0 ).should.throw();
			Route.parseTarget.bind( Route, [] ).should.throw();
			Route.parseTarget.bind( Route, [function() {}] ).should.throw();
			Route.parseTarget.bind( Route, ["Custom::myHandler"] ).should.throw();
			Route.parseTarget.bind( Route, ["Custom.myHandler"] ).should.throw();
			Route.parseTarget.bind( Route, [ "Custom", "myHandler" ] ).should.throw();
			Route.parseTarget.bind( Route, ["Filter::myImplementation"] ).should.throw();
			Route.parseTarget.bind( Route, ["Filter.myImplementation"] ).should.throw();
			Route.parseTarget.bind( Route, [ "Filter", "myImplementation" ] ).should.throw();
			Route.parseTarget.bind( Route, {} ).should.throw();
			Route.parseTarget.bind( Route, { controller: "Custom", method: "myHandler" } ).should.throw();
			Route.parseTarget.bind( Route, { controller: "Filter", method: "myImplementation" } ).should.throw();
			Route.parseTarget.bind( Route, "" ).should.throw();

			// using valid parameters with abstract base class `Route`
			Route.parseTarget.bind( Route, "Custom::myHandler" ).should.throw();
			Route.parseTarget.bind( Route, "Custom.myHandler" ).should.throw();
			Route.parseTarget.bind( Route, "Filter::myImplementation" ).should.throw();
			Route.parseTarget.bind( Route, "Filter.myImplementation" ).should.throw();

			// valid target definitions, but still lacking API as context
			PolicyRoute.parseTarget.bind( PolicyRoute, "Filter::myImplementation" ).should.throw();
			PolicyRoute.parseTarget.bind( PolicyRoute, "Filter.myImplementation" ).should.throw();
			PolicyRoute.parseTarget.bind( PolicyRoute, { controller: "Filter", method: "myImplementation" } ).should.throw();
		} );
	} );

	it( "rejects invalid types of values for defining target of routing", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			Route.parseTarget.bind( Route, null, API ).should.throw();
			Route.parseTarget.bind( Route, undefined, API ).should.throw();
			Route.parseTarget.bind( Route, false, API ).should.throw();
			Route.parseTarget.bind( Route, true, API ).should.throw();
			Route.parseTarget.bind( Route, 1.0, API ).should.throw();
			Route.parseTarget.bind( Route, -0.0, API ).should.throw();
			Route.parseTarget.bind( Route, {}, API ).should.throw();
			Route.parseTarget.bind( Route, { controller: "Custom", method: "myHandler" }, API ).should.throw();
			Route.parseTarget.bind( Route, { controller: "Filter", method: "myImplementation" }, API ).should.throw();
			Route.parseTarget.bind( Route, "", API ).should.throw();
		} );
	} );

	it( "accepts policy target definitions as string", function() {
		return ApiMockUp.then( function( { API, RouteModule: { PolicyRoute } } ) {
			let target = PolicyRoute.parseTarget( "Filter::myImplementation", API );
			Should.exist( target );
			target.handler.should.be.Function();
			Should( target.warning ).not.be.ok();

			target = PolicyRoute.parseTarget( "Filter.myImplementation", API );
			Should.exist( target );
			target.handler.should.be.Function();
			Should( target.warning ).not.be.ok();

			target = PolicyRoute.parseTarget( { controller: "Filter", method: "myImplementation" }, API );
			Should.exist( target );
			target.handler.should.be.Function();
			Should( target.warning ).not.be.ok();
		} );
	} );

	it( "rejects multiple policy target definitions provided as array (even though supporting lists of targets per policy route)", function() {
		return ApiMockUp.then( function( { API, RouteModule: { PolicyRoute } } ) {
			PolicyRoute.parseTarget.bind( PolicyRoute, [], API ).should.throw();
			PolicyRoute.parseTarget.bind( PolicyRoute, [function() {}], API ).should.throw();
			PolicyRoute.parseTarget.bind( PolicyRoute, ["Custom::myHandler"], API ).should.throw();
			PolicyRoute.parseTarget.bind( PolicyRoute, ["Custom.myHandler"], API ).should.throw();
			PolicyRoute.parseTarget.bind( PolicyRoute, [ "Custom", "myHandler" ], API ).should.throw();
			PolicyRoute.parseTarget.bind( PolicyRoute, ["Filter::myImplementation"], API ).should.throw();
			PolicyRoute.parseTarget.bind( PolicyRoute, ["Filter.myImplementation"], API ).should.throw();
			PolicyRoute.parseTarget.bind( PolicyRoute, [ "Filter", "myImplementation" ], API ).should.throw();
		} );
	} );

	it( "rejects multiple route target definitions provided as array", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			Route.parseTarget.bind( Route, [], API ).should.throw();
			Route.parseTarget.bind( Route, [function() {}], API ).should.throw();
			Route.parseTarget.bind( Route, ["Custom::myHandler"], API ).should.throw();
			Route.parseTarget.bind( Route, ["Custom.myHandler"], API ).should.throw();
			Route.parseTarget.bind( Route, [ "Custom", "myHandler" ], API ).should.throw();
			Route.parseTarget.bind( Route, ["Filter::myImplementation"], API ).should.throw();
			Route.parseTarget.bind( Route, ["Filter.myImplementation"], API ).should.throw();
			Route.parseTarget.bind( Route, [ "Filter", "myImplementation" ], API ).should.throw();
		} );
	} );

	it( "rejects policy target definitions addressing actions in wrong collection", function() {
		return ApiMockUp.then( function( { API, RouteModule: { PolicyRoute } } ) {
			let target = PolicyRoute.parseTarget( "Custom::myHandler", API );
			Should.exist( target );
			Should.not.exist( target.handler );
			target.warning.should.be.String().and.not.empty();

			target = PolicyRoute.parseTarget( "Custom.myHandler", API );
			Should.exist( target );
			Should.not.exist( target.handler );
			target.warning.should.be.String().and.not.empty();

			target = PolicyRoute.parseTarget( { controller: "Custom", method: "myHandler" }, API );
			Should.exist( target );
			Should.not.exist( target.handler );
			target.warning.should.be.String().and.not.empty();
		} );
	} );

	it( "accepts terminal target definitions as string", function() {
		return ApiMockUp.then( function( { API, RouteModule: { TerminalRoute } } ) {
			let target = TerminalRoute.parseTarget( "Custom::myHandler", API );
			Should.exist( target );
			target.handler.should.be.Function();
			Should( target.warning ).not.be.ok();

			target = TerminalRoute.parseTarget( "Custom.myHandler", API );
			Should.exist( target );
			target.handler.should.be.Function();
			Should( target.warning ).not.be.ok();

			target = TerminalRoute.parseTarget( { controller: "Custom", method: "myHandler" }, API );
			Should.exist( target );
			target.handler.should.be.Function();
			Should( target.warning ).not.be.ok();
		} );
	} );

	it( "rejects policy target definitions addressing actions in wrong collection", function() {
		return ApiMockUp.then( function( { API, RouteModule: { TerminalRoute } } ) {
			let target = TerminalRoute.parseTarget( "Filter::myImplementation", API );
			Should.exist( target );
			Should.not.exist( target.handler );
			target.warning.should.be.String().and.not.empty();

			target = TerminalRoute.parseTarget( "Filter.myImplementation", API );
			Should.exist( target );
			Should.not.exist( target.handler );
			target.warning.should.be.String().and.not.empty();

			target = TerminalRoute.parseTarget( { controller: "Filter", method: "myImplementation" }, API );
			Should.exist( target );
			Should.not.exist( target.handler );
			target.warning.should.be.String().and.not.empty();
		} );
	} );
} );

describe( "Library.Router.Types.Route.Route#generateExamples", function() {
	it( "provides given 'pattern' as example on a route bound to fully static path", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			let path = "/";
			let route = new Route( path, () => {}, API );

			let examples = route.generateExamples();
			examples.should.be.Array().and.have.length( 1 );
			examples[0].should.be.equal( path );

			path = "/some/static/test/path";
			route = new Route( path, () => {}, API );

			examples = route.generateExamples();
			examples.should.be.Array().and.have.length( 1 );
			examples[0].should.equal( path );
		} );
	} );

	it( "generates single example on a route bound to path including single mandatory named parameter", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			const path = "/myPrefix/:param/more-static";
			const route = new Route( path, () => {}, API );

			const examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 1 );
			examples[0].startsWith( "/myPrefix/" ).should.be.ok();
			examples[0].endsWith( "/more-static" ).should.be.ok();
			examples[0].should.not.equal( path );
		} );
	} );

	it( "generates single example on a route bound to path including multiple mandatory named parameter", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			const path = "/myPrefix/:param/:info/:id/more-static";
			const route = new Route( path, () => {}, API );

			const examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 1 );
			examples[0].startsWith( "/myPrefix/" ).should.be.ok();
			examples[0].endsWith( "/more-static" ).should.be.ok();
			examples[0].should.not.equal( path );
		} );
	} );

	it( "generates two examples on a route bound to path including single optional named parameter", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			const path = "/myPrefix/:param?/more-static";
			const route = new Route( path, () => {}, API );

			const examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 2 );
			examples[0].startsWith( "/myPrefix/" ).should.be.ok();
			examples[0].endsWith( "/more-static" ).should.be.ok();
			examples[0].should.equal( "/myPrefix/more-static" );

			examples[1].startsWith( "/myPrefix/" ).should.be.ok();
			examples[1].endsWith( "/more-static" ).should.be.ok();
			examples[1].should.not.equal( "/myPrefix/more-static" );
			examples[1].should.not.equal( path );
		} );
	} );

	it( "generates single example on a route bound to path including single optional named parameter due to providing custom value", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			const path = "/myPrefix/:param?/more-static";
			const route = new Route( path, () => {}, API );

			const examples = route.generateExamples( { param: "test" } );

			examples.should.be.Array().and.have.length( 1 );
			examples[0].startsWith( "/myPrefix/" ).should.be.ok();
			examples[0].endsWith( "/more-static" ).should.be.ok();
			examples[0].should.equal( "/myPrefix/test/more-static" );
		} );
	} );

	it( "requires provision of custom value matching name of parameter explicitly", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			const path = "/myPrefix/:param?/:item?/more-static";
			const route = new Route( path, () => {}, API );

			let examples = route.generateExamples( { param: "test", item: "rest" } );

			examples.should.be.Array().and.have.length( 1 );
			examples[0].should.equal( "/myPrefix/test/rest/more-static" );

			examples = route.generateExamples( {} );

			examples.should.be.Array().and.have.length( 4 );
			examples[0].should.equal( "/myPrefix/more-static" );
			examples[3].should.not.equal( "/myPrefix/more-static" );
			examples[3].should.not.equal( "/myPrefix/undefined/undefined/more-static" );
		} );
	} );

	it( "generates three examples with up to three elements per repeatable mandatory named parameter", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			const path = "/myPrefix/:param+/more-static";
			const route = new Route( path, () => {}, API );

			const examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 3 );
			examples[0].startsWith( "/myPrefix/" ).should.be.ok();
			examples[0].endsWith( "/more-static" ).should.be.ok();
			examples[0].should.not.equal( "/myPrefix/more-static" );

			examples[1].startsWith( "/myPrefix/" ).should.be.ok();
			examples[1].endsWith( "/more-static" ).should.be.ok();
			examples[1].should.not.equal( "/myPrefix/more-static" );

			examples[2].startsWith( "/myPrefix/" ).should.be.ok();
			examples[2].endsWith( "/more-static" ).should.be.ok();
			examples[2].should.not.equal( "/myPrefix/more-static" );
		} );
	} );

	it( "generates four examples with up to three elements per repeatable optional named parameter", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			const path = "/myPrefix/:param*/more-static";
			const route = new Route( path, () => {}, API );

			const examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 4 );
			examples[0].startsWith( "/myPrefix/" ).should.be.ok();
			examples[0].endsWith( "/more-static" ).should.be.ok();
			examples[0].should.equal( "/myPrefix/more-static" );

			examples[1].startsWith( "/myPrefix/" ).should.be.ok();
			examples[1].endsWith( "/more-static" ).should.be.ok();
			examples[1].should.not.equal( "/myPrefix/more-static" );

			examples[2].startsWith( "/myPrefix/" ).should.be.ok();
			examples[2].endsWith( "/more-static" ).should.be.ok();
			examples[2].should.not.equal( "/myPrefix/more-static" );

			examples[3].startsWith( "/myPrefix/" ).should.be.ok();
			examples[3].endsWith( "/more-static" ).should.be.ok();
			examples[3].should.not.equal( "/myPrefix/more-static" );
		} );
	} );

	it( "doubles number of generated examples per optional named parameter in path", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			let route = new Route( "/myPrefix/:param?/more-static", () => {}, API );
			let examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 2 );

			route = new Route( "/myPrefix/:param?/:info?/more-static", () => {}, API );
			examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 4 );

			route = new Route( "/myPrefix/:param?/:info?/:id?/more-static", () => {}, API );
			examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 8 );

			route = new Route( "/myPrefix/:param?/:info?/:id?/:test?/more-static", () => {}, API );
			examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 16 );
		} );
	} );

	it( "multiplies number of generated examples by three per mandatory repeatable named parameter in path", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			let route = new Route( "/myPrefix/:param+/more-static", () => {}, API );
			let examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 3 );

			route = new Route( "/myPrefix/:param+/:info+/more-static", () => {}, API );
			examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 9 );

			route = new Route( "/myPrefix/:param+/:info+/:id+/more-static", () => {}, API );
			examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 27 );

			route = new Route( "/myPrefix/:param+/:info+/:id+/:test+/more-static", () => {}, API );
			examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 81 );
		} );
	} );

	it( "multiplies number of generated examples by four per optional repeatable named parameter in path", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			let route = new Route( "/myPrefix/:param*/more-static", () => {}, API );
			let examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 4 );

			route = new Route( "/myPrefix/:param*/:info*/more-static", () => {}, API );
			examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 16 );

			route = new Route( "/myPrefix/:param*/:info*/:id*/more-static", () => {}, API );
			examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 64 );

			route = new Route( "/myPrefix/:param*/:info*/:id*/:test*/more-static", () => {}, API );
			examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 256 );
		} );
	} );

	it( "multiplies accordingly on combining different kinds of parameter options in path", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			let route = new Route( "/myPrefix/:param*/more-static", () => {}, API );
			let examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 4 );

			route = new Route( "/myPrefix/:param*/:info+/more-static", () => {}, API );
			examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 12 );

			route = new Route( "/myPrefix/:param*/:info+/:id?/more-static", () => {}, API );
			examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 24 );

			route = new Route( "/myPrefix/:param*/:info+/:id?/:test/more-static", () => {}, API );
			examples = route.generateExamples();

			examples.should.be.Array().and.have.length( 24 );
		} );
	} );

	it( "generates single example on a route with all its parameters mandatorily bound to fixed value", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			const path = "/myPrefix/:param/:test/more-static";
			const route = new Route( path, () => {}, API );

			let examples = route.generateExamples( { param: "first", test: "second" } );

			examples.should.be.Array().and.have.length( 1 );
			examples[0].should.equal( "/myPrefix/first/second/more-static" );

			examples = route.generateExamples( { param: "first", test: "second" }, { fixValue: "*" } );

			examples.should.be.Array().and.have.length( 1 );
			examples[0].should.equal( "/myPrefix/*/*/more-static" );
		} );
	} );

	it( "generates single example with minimum use of parameters ignoring usual number of probable use cases", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			const path = "/myPrefix/:param?/:item?/:id?/more-static";
			const route = new Route( path, () => {}, API );

			let examples = route.generateExamples( {} );

			examples.should.be.Array();
			examples.length.should.be.greaterThan( 1 );

			examples = route.generateExamples( {}, { minLengthOnly: true, fixValue: "*" } );

			examples.should.be.Array().and.have.length( 1 );
			examples[0].should.equal( "/myPrefix/more-static" );
		} );
	} );

	it( "generates single example with maximum use of parameters ignoring usual number of probable use cases", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			const path = "/myPrefix/:param?/:item?/:id?/more-static";
			const route = new Route( path, () => {}, API );

			let examples = route.generateExamples( {} );

			examples.should.be.Array();
			examples.length.should.be.greaterThan( 1 );

			examples = route.generateExamples( {}, { maxLengthOnly: true, fixValue: "*" } );

			examples.should.be.Array().and.have.length( 1 );
			examples[0].should.equal( "/myPrefix/*/*/*/more-static" );
		} );
	} );

	it( "generates single example with provided set of data on a repeating parameter", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			const path = "/myPrefix/:param*/more-static";
			const route = new Route( path, () => {}, API );

			let examples = route.generateExamples( {} );

			examples.should.be.Array();
			examples.length.should.be.greaterThan( 1 );

			examples = route.generateExamples( {}, { maxLengthOnly: true, fixValue: [ "*", "-", ".", "_" ] } );

			examples.should.be.Array().and.have.length( 1 );
			examples[0].should.equal( "/myPrefix/*/-/./_/more-static" );
		} );
	} );

	it( "generates single example of maximum size with at most three random values on a repeating parameter", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route } } ) {
			const path = "/myPrefix/:param*/more-static";
			const route = new Route( path, () => {}, API );

			let examples = route.generateExamples( {} );

			examples.should.be.Array();
			examples.length.should.be.greaterThan( 1 );

			examples = route.generateExamples( {}, { maxLengthOnly: true } );

			examples.should.be.Array().and.have.length( 1 );
			examples[0].split( "/" ).should.have.length( 6 );   // empty prefix to leading /, two static segments and three random values

			examples = route.generateExamples( {}, { maxLengthOnly: true, fixValue: [ "*", "-", ".", "_" ] } );

			examples.should.be.Array().and.have.length( 1 );
			examples[0].split( "/" ).should.have.length( 7 );   // same as above, but using all four provided values
		} );
	} );

} );

describe( "Library.Router.Types.Route.Route#selectProbablyCoveredPrefixes", function() {
	it( "requires list of prefixes to be filtered", function() {
		return ApiMockUp.then( function( { API, RouteModule: { PolicyRoute, TerminalRoute } } ) {
			let route = new TerminalRoute( "/", () => {}, API );

			route.selectProbablyCoveredPrefixes.bind( route ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, null ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, undefined ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, false ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, true ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, 1.0 ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, -0.0 ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, [function() {}] ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, [""] ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, {} ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, { prefix: "/test" } ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, "" ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, "/test" ).should.throw();

			route.selectProbablyCoveredPrefixes.bind( route, [] ).should.not.throw();
			route.selectProbablyCoveredPrefixes.bind( route, ["/test"] ).should.not.throw();
			route.selectProbablyCoveredPrefixes.bind( route, [ "/test", "/taste" ] ).should.not.throw();

			route = new PolicyRoute( "/", () => {}, API );

			route.selectProbablyCoveredPrefixes.bind( route ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, null ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, undefined ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, false ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, true ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, 1.0 ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, -0.0 ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, [function() {}] ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, [""] ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, {} ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, { prefix: "/test" } ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, "" ).should.throw();
			route.selectProbablyCoveredPrefixes.bind( route, "/test" ).should.throw();

			route.selectProbablyCoveredPrefixes.bind( route, [] ).should.not.throw();
			route.selectProbablyCoveredPrefixes.bind( route, ["/test"] ).should.not.throw();
			route.selectProbablyCoveredPrefixes.bind( route, [ "/test", "/taste" ] ).should.not.throw();
		} );
	} );

	it( "considers some generic route probably covering some specific prefix", function() {
		return ApiMockUp.then( function( { API, RouteModule: { Route, TerminalRoute } } ) {
			[
				{ generic: "/", specific: "/test/name/sub" },
				{ generic: "/test/name/sub", specific: "/test/name/sub", full: true },
				{ generic: "/test/name/s", specific: "/test/name/sub" },
				{ generic: "/test/n", specific: "/test/name/sub" },
				{ generic: "/test/name", specific: "/test/name/sub" },
				{ generic: "/test", specific: "/test/name/sub" },
				{ generic: "/tes", specific: "/test/name/sub" },
				{ generic: "/te", specific: "/test/name/sub" },
				{ generic: "/t", specific: "/test/name/sub" },

				{ generic: "/test(.)?", specific: "/test/name/sub" },
				{ generic: "/test(.)+", specific: "/test/name/sub" },
				{ generic: "/test/:test*", specific: "/test/name/sub" },

				{ generic: "/(test)?", specific: "/test/name/sub" },
				{ generic: "/(test)+", specific: "/test/name/sub" },
				{ generic: "/(test)*", specific: "/test/name/sub" },
				{ generic: "/(sth)?/test/name", specific: "/test/name/sub" },
				{ generic: "/(sth)*/test/name", specific: "/test/name/sub" },
				{ generic: "/(test)+/name", specific: "/test/name/sub" },
				{ generic: "/test/:minor", specific: "/test/name/sub" },
				{ generic: "/test/:minor?", specific: "/test/name/sub" },
				{ generic: "/test/:minor+", specific: "/test/name/sub" },
				{ generic: "/test/:minor*", specific: "/test/name/sub" },
				{ generic: "/:major", specific: "/test/name/sub" },
				{ generic: "/:major?", specific: "/test/name/sub" },
				{ generic: "/:major+", specific: "/test/name/sub" },
				{ generic: "/:major*", specific: "/test/name/sub" },
				{ generic: "/:major/name", specific: "/test/name/sub" },
				{ generic: "/:major?/test", specific: "/test/name/sub" },
				{ generic: "/:major?/name", specific: "/test/name/sub" },
				{ generic: "/:major*/test", specific: "/test/name/sub" },
				{ generic: "/:major*/name", specific: "/test/name/sub" },
				{ generic: "/:major*/sub", specific: "/test/name/sub" },
				{ generic: "/:major+/name", specific: "/test/name/sub" },
				{ generic: "/:major+/sub", specific: "/test/name/sub" },
				{ generic: "/:major/:minor", specific: "/test/name/sub" },
				{ generic: "/:major/:minor?", specific: "/test/name/sub" },
				{ generic: "/:major/:minor+", specific: "/test/name/sub" },
				{ generic: "/:major/:minor*", specific: "/test/name/sub" },
				{ generic: "/test/:minor/sub", specific: "/test/name/sub" },
				{ generic: "/test/:minor?/name", specific: "/test/name/sub" },
				{ generic: "/test/:minor*/name", specific: "/test/name/sub" },
				{ generic: "/test/:minor+/sub", specific: "/test/name/sub" },
			]
				.forEach( ( { generic, specific, full = false } ) => {
					const route = new TerminalRoute( generic, () => {}, API );
					const covered = route.selectProbablyCoveredPrefixes( [specific] );

					// console.log( generic, "->", specific, "=", covered[specific] === Route.MATCH_FULL ? "full" : "partial" );

					covered.should.be.Object()
						.and.have.property( specific )
						.and.be.greaterThanOrEqual( full ? Route.MATCH_FULL : Route.MATCH_PARTIAL, `invalid mark on ${specific} covered by ${generic}` );
				} );
		} );
	} );

	it( "considers some generic but divergent route never covering some specific prefix", function() {
		return ApiMockUp.then( function( { API, RouteModule: { TerminalRoute } } ) {
			[
				{ generic: "/test/name/sub/item", specific: "/test/name/sub" },
				{ generic: "/test/name/subs", specific: "/test/name/sub" },
				{ generic: "/test/name/su/b", specific: "/test/name/sub" },
				{ generic: "/teste", specific: "/test/name/sub" },
				{ generic: "/tee", specific: "/test/name/sub" },
				{ generic: "/s", specific: "/test/name/sub" },
				{ generic: "/t\\a(st)?", specific: "/test/name/sub" },
				{ generic: "/t\\a(st)*", specific: "/test/name/sub" },
				{ generic: "/(tas)+", specific: "/test/name/sub" },
				{ generic: "/ta(s)*", specific: "/test/name/sub" },
				{ generic: "/tast/:minor", specific: "/test/name/sub" },
				{ generic: "/tast/:minor?", specific: "/test/name/sub" },
				{ generic: "/tast/:minor*", specific: "/test/name/sub" },
				{ generic: "/:major/neme", specific: "/test/name/sub" },
				{ generic: "/:major?/neme", specific: "/test/name/sub" },
				{ generic: "/:major*/neme", specific: "/test/name/sub" },
				{ generic: "/:major+/neme", specific: "/test/name/sub" },
			]
				.forEach( ( { generic, specific } ) => {
					const route = new TerminalRoute( generic, () => {}, API );
					const covered = route.selectProbablyCoveredPrefixes( [specific] );

					// console.log( generic, "->", specific );

					covered.should.be.Object()
						.and.not.have.property( specific );
				} );
		} );
	} );
} );
