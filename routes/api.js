/*
|--------------------------------------------------------------------------
| Variable
|--------------------------------------------------------------------------
*/
	// Node Modules
	const NJWT = require( 'njwt' );
	const JWTDecode = require( 'jwt-decode' );
	const RoutesVersioning = require( 'express-routes-versioning' )();
	
	// Controllers
	const Controllers = {
		v_1_0: {
			Finding: require( _directory_base + '/app/controllers/v1.0/FindingController.js' )
		}
	}

/*
 |--------------------------------------------------------------------------
 | Routing
 |--------------------------------------------------------------------------
 */
	module.exports = ( app ) => {

		/*
		 |--------------------------------------------------------------------------
		 | Default
		 |--------------------------------------------------------------------------
		 */
			app.get( '/', ( req, res ) => {
				res.json( { 'message': config.app.name } )
			} );
		/*
		 |--------------------------------------------------------------------------
		 | Finding
		 |--------------------------------------------------------------------------
		 */
			app.get( '/finding', verifyToken, RoutesVersioning( {
				"1.0.0": Controllers.v_1_0.Finding.find
			} ) );

			app.get( '/finding/all', verifyToken, RoutesVersioning( {
				"1.0.0": Controllers.v_1_0.Finding.findAll
			} ) );

			app.get( '/finding/q', verifyToken, RoutesVersioning( {
				"1.0.0": Controllers.v_1_0.Finding.findAll
			} ) );

			app.get( '/finding/:id', verifyToken, RoutesVersioning( {
				"1.0.0": Controllers.v_1_0.Finding.findOne
			} ) );

			app.post( '/finding', verifyToken, RoutesVersioning( {
				"1.0.0": Controllers.v_1_0.Finding.create
			} ) );

		/*
		 |--------------------------------------------------------------------------
		 | Finding Sync Mobile
		 |--------------------------------------------------------------------------
		 */
			app.get( '/sync-mobile/finding/:start_date/:end_date', verifyToken, RoutesVersioning( {
				"1.0.0": Controllers.v_1_0.Finding.syncMobile
			} ) );

			app.get( '/sync-mobile/finding-images/:start_date/:end_date', verifyToken, RoutesVersioning( {
				"1.0.0": Controllers.v_1_0.Finding.syncMobileImages
			} ) );
		/*
		 |--------------------------------------------------------------------------
		 | Finding Report
		 |--------------------------------------------------------------------------
		 */
			app.get( '/finding-report/all', verifyToken, RoutesVersioning( {
				"1.0.0": Controllers.v_1_0.Finding.findReport
			} ) );

			app.get( '/finding-report/q', verifyToken, RoutesVersioning( {
				"1.0.0": Controllers.v_1_0.Finding.findReport
			} ) );
	}

/*
|--------------------------------------------------------------------------
| Verify Token
|--------------------------------------------------------------------------
*/
	function verifyToken( req, res, next ) {
		// Get auth header value
		const bearer_header = req.headers['authorization'];
		if ( typeof bearer_header !== 'undefined' ) {
			const bearer = bearer_header.split( ' ' );
			const bearer_token = bearer[1];
			req.token = bearer_token;
			NJWT.verify( bearer_token, config.app.secret_key, config.app.token_algorithm, ( err, authData ) => {
				if ( err ) {
					res.send({
						status: false,
						message: "Invalid Token",
						data: []
					} );
				}
				else {
					req.auth = JWTDecode( req.token );
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