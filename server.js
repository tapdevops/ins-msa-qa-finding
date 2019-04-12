/*
|--------------------------------------------------------------------------
| Global APP Init
|--------------------------------------------------------------------------
*/
	global._directory_base = __dirname;
	global.config = {};
		  config.app = require( './config/app.js' );
		  config.database = require( './config/database.js' )[config.app.env];

/*
|--------------------------------------------------------------------------
| APP Setup
|--------------------------------------------------------------------------
*/
	// Node Modules
	const bodyParser = require( 'body-parser' );
	const express = require( 'express' );
	const mongoose = require( 'mongoose' );

	// Primary Variable
	const app = express();

/*
|--------------------------------------------------------------------------
| APP Init
|--------------------------------------------------------------------------
*/
	// Parse request of content-type - application/x-www-form-urlencoded
	app.use( bodyParser.urlencoded( { extended: false } ) );

	// Parse request of content-type - application/json
	app.use( bodyParser.json() );

	// Setup Database
	mongoose.Promise = global.Promise;
	mongoose.connect( config.database.url, {
		useNewUrlParser: true,
		ssl: config.database.ssl
	} ).then( () => {
		console.log( 'Successfully connected to the Database (' + config.database.url + ')' );
	} ).catch( err => {
		console.log( 'Could not connect to the Database. Exiting application.' )
	} );

	// Server Running Message
	app.listen( config.app.port, () => {
		console.log( 'Server ' + config.app.name + ' Berjalan di port ' + config.app.port );
	} );

	// Routing
	require( './routes/api.js' )( app );
	module.exports = app;