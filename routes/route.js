/*
|--------------------------------------------------------------------------
| Variable
|--------------------------------------------------------------------------
*/
	// Config
	const config = require( _directory_base + '/config/config.js' );

	// Node Modules
	const jwt = require( 'jsonwebtoken' );
	const uuid = require( 'uuid' );
	const nJwt = require( 'njwt' );
	const jwtDecode = require( 'jwt-decode' );

	// Declare Controllers
	const FindingController = require( _directory_base + '/app/controllers/FindingController.js' );

/*
 |--------------------------------------------------------------------------
 | Routing
 |--------------------------------------------------------------------------
 */
	module.exports = ( app ) => {

		/*
		 |--------------------------------------------------------------------------
		 | Finding
		 |--------------------------------------------------------------------------
		 */
			app.post( '/finding', token_verify, FindingController.create );
			app.get( '/finding/all', token_verify, FindingController.findAll );
			app.get( '/finding/q', token_verify, FindingController.findAll );
			app.get( '/finding', token_verify, FindingController.find );
			app.get( '/finding/:id', token_verify, FindingController.findOne );
			app.put( '/finding/:id', verifyToken, FindingController.update );
			app.delete( '/finding/:id', verifyToken, FindingController.delete );

		/*
		 |--------------------------------------------------------------------------
		 | Finding Sync Mobile
		 |--------------------------------------------------------------------------
		 */
			app.get( '/sync-mobile/finding/:start_date/:end_date', token_verify, FindingController.syncMobile );
			app.get( '/sync-mobile/finding-images/:start_date/:end_date', token_verify, FindingController.syncMobileImages );

		/*
		 |--------------------------------------------------------------------------
		 | Finding Report
		 |--------------------------------------------------------------------------
		 */
			app.get( '/finding-report/all', token_verify, FindingController.findReport );
			app.get( '/finding-report/q', token_verify, FindingController.findReport );

		/*
		 |--------------------------------------------------------------------------
		 | Finding Etc
		 |--------------------------------------------------------------------------
		 */
			app.get( '/finding-history', verifyToken, FindingController.findByTokenAuthCode );
	}

/*
|--------------------------------------------------------------------------
| Token Verify
|--------------------------------------------------------------------------
*/
function verifyToken( req, res, next ) {
	// Get auth header value
	const bearerHeader = req.headers['authorization'];

	if ( typeof bearerHeader !== 'undefined' ) {
		const bearer = bearerHeader.split( ' ' );
		const bearerToken = bearer[1];

		req.token = bearerToken;
		next();
	}
	else {
		// Forbidden
		res.sendStatus( 403 );
	}
}

function token_verify( req, res, next ) {
	// Get auth header value
	const bearerHeader = req.headers['authorization'];

	if ( typeof bearerHeader !== 'undefined' ) {
		const bearer = bearerHeader.split( ' ' );
		const bearer_token = bearer[1];

		req.token = bearer_token;

		nJwt.verify( bearer_token, config.secret_key, config.token_algorithm, ( err, authData ) => {
			if ( err ) {
				res.send({
					status: false,
					message: "Invalid Token",
					data: []
				} );
			}
			else {
				req.auth = jwtDecode( req.token );
				req.auth.LOCATION_CODE_GROUP = req.auth.LOCATION_CODE.split( ',' );
				req.config = config;
				next();
			}
		} );
		
	}
	else {
		// Forbidden
		res.sendStatus( 403 );
	}
}