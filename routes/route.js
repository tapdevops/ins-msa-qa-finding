const jwt = require( 'jsonwebtoken' );
const config = require( '../config/config.js' );
const uuid = require( 'uuid' );
const nJwt = require( 'njwt' );
const jwtDecode = require( 'jwt-decode' );

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

module.exports = ( app ) => {
	// Declare Controllers
	const finding = require( '../app/controllers/finding.js' );

	// ROUTE - FINDING
	app.post( '/finding', token_verify, finding.create );
	app.get( '/finding/all', token_verify, finding.findAll );
	app.get( '/finding/q', token_verify, finding.findAll );
	app.get( '/finding', token_verify, finding.find );
	app.get( '/finding/:id', token_verify, finding.findOne );
	app.get( '/finding-history', verifyToken, finding.findByTokenAuthCode );
	app.put( '/finding/:id', verifyToken, finding.update );
	app.delete( '/finding/:id', verifyToken, finding.delete );
	app.get( '/sync-mobile/finding/:start_date/:end_date', token_verify, finding.syncMobile );
}

