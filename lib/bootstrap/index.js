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

/**
 * @this HitchyAPI
 * @param {HitchyOptions} options global options customizing Hitchy
 * @returns {HitchyBootstrapAPI} part of Hitchy API exposing bootstrap stages
 */
module.exports = function( options ) {
	return /** @lends HitchyBootstrapAPI */ {
		triangulate: require( "./triangulate" ).call( this, options ),
		discover: require( "./discover" ).call( this, options ),
		configure: require( "./configure" ).call( this, options ),
		expose: require( "./expose" ).call( this, options ),
		initialize: require( "./initialize" ).call( this, options ),
		routing: require( "./routing" ).call( this, options ),
		prepareShutdown: require( "./prepareShutdown" ).call( this, options ),
		shutdown: function() { return Promise.resolve(); },    // NOP to be replaced by prepareShutdown() invoked by library loader in lib/index.js
	};
};
