const express = require( 'express' );							// Import Express
const mongoose = require( 'mongoose' );							// Import Mongoose
const bodyParser = require( 'body-parser' ); 					// Import Body Parser
const app = express(); 											// Define App
const config = require( './config/config.js' ); 				// Config
const dbConfig = require( './config/database.js' ); 			// Database Config
// Setup Database
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect( dbConfig.url, {
	useNewUrlParser: true,
	ssl: true
} ).then( () => {
	console.log( 'Successfully connected to the Database' );
} ).catch( err => {
	console.log( 'Could not connect to the Database. Exiting application.' )
} );

// Parse request of content-type - application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: false } ) );

// Parse request of content-type - application/json
app.use( bodyParser.json() );
// Server Running Message
app.listen( config.app_port, () => {
	console.log( config.app_name + ' running on ' + config.app_port )
} );
app.get( '/', ( req, res ) => {
	res.json( { 'message': config.app_name } )
} );
require( './routes/route.js' )( app );