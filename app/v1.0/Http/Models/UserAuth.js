/*
 |--------------------------------------------------------------------------
 | Models - View User Auth
 |--------------------------------------------------------------------------
 */
	const Mongoose = require( 'mongoose' );
	const connAuth = Mongoose.createConnection("mongodb://s_auth:s_auth@dbappdev.tap-agri.com:4848/s_auth?authSource=s_auth");
	const ViewUserAuthSchema = Mongoose.Schema( {});

/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
	module.exports = connAuth.model( 'ViewUserAuth', ViewUserAuthSchema, 'VIEW_USER_AUTH' );