"use strict";

let options = {
	projectFolder: "test/projects/routing-basics",
	scenario: "blueprint",
	// debug: true,
};

require( "should" );
require( "should-http" );

const Test = require( "../../../../tools/index" ).test;
const Hitchy = require( "../../../../injector/index" ).node( options );

// ----------------------------------------------------------------------------

suite( "Serving project in basic-routing-core w/ route accompanying blueprints", function() {
	suiteSetup( () => Test.startServer( Hitchy ) );
	suiteTeardown( () => Hitchy.stop() );

	test( "hits blueprint terminal route on GETting /blueprint/1234", function() {
		return Hitchy.onStarted.then( () => Test.get( "/blueprint/1234" )
			.then( function( response ) {
				response.should.have.status( 200 );
				response.should.be.json();
				response.data.should.have.properties( "session", "gotBlueprint" ).and.have.size( 2 );
			} ) );
	} );

	test( "misses blueprint terminal route on GETting /blueprint/catched due to preceding custom route", function() {
		return Hitchy.onStarted.then( () => Test.get( "/blueprint/catched" )
			.then( function( response ) {
				response.should.have.status( 200 );
				response.should.be.json();
				response.data.should.not.have.properties( "gotBlueprint" );
				response.data.method.should.equal( "GET" );
			} ) );
	} );

	test( "hits blueprint terminal route on GETting /blueprint/missed due to custom route succeeding blueprint", function() {
		return Hitchy.onStarted.then( () => Test.get( "/blueprint/missed" )
			.then( function( response ) {
				response.should.have.status( 200 );
				response.should.be.json();
				response.data.should.have.properties( "session", "gotBlueprint" ).and.have.size( 2 );
			} ) );
	} );
} );

// NOTE Can't add another suite this time for using scenarios for dynamically
//      switching configuration to suit different testing goals in a single project.