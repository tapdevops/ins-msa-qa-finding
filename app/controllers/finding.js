const findingModel = require( '../models/finding.js' );
const findingLogModel = require( '../models/findingLog.js' );
const config = require( '../../config/config.js' ); 	
const uuid = require( 'uuid' );
const nJwt = require( 'njwt' );
const dateAndTimes = require( 'date-and-time' );
const jwtDecode = require( 'jwt-decode' );
const randomTextLib = require( '../libraries/randomText' );

// Create and Save new Data
exports.create = ( req, res ) => {

	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		
		if( !req.body.WERKS || !req.body.AFD_CODE || !req.body.BLOCK_CODE ) {
			return res.status( 400 ).send({
				status: false,
				message: 'Invalid input',
				data: {}
			});
		}

		var auth = jwtDecode( req.token );
		var randomText = randomTextLib.generate( 5 );
		var CODE = auth.EMPLOYEE_NIK + 
			'-FIN-' + 
			dateAndTimes.format( new Date(), 'YYYYMMDD' ) + 
			'-' + 
			req.body.WERKS + 
			'-H-' + 
			req.body.BLOCK_CODE + 
			'-' + 
			randomText;

		console.log( CODE );
		console.log( randomTextLib.generate( 5 ) );
		console.log( auth );

		const set = new findingModel( {
			FINDING_CODE: CODE,
			WERKS: req.body.WERKS || "",
			AFD_CODE: req.body.AFD_CODE || "",
			BLOCK_CODE: req.body.BLOCK_CODE || "",
			FINDING_CATEGORY: req.body.FINDING_CATEGORY || "",
			FINDING_DESC: req.body.FINDING_DESC || "",
			FINDING_PRIORITY: req.body.FINDING_PRIORITY || "",
			DUE_DATE: req.body.DUE_DATE || "",
			ASSIGN_TO: req.body.ASSIGN_TO || "",
			PROGRESS: req.body.PROGRESS || "",
			LAT_FINDING: req.body.LAT_FINDING || "",
			LONG_FINDING: req.body.LONG_FINDING || "",
			REFFERENCE_INS_CODE: req.body.REFFERENCE_INS_CODE || "",

			//INSERT_USER: auth.USER_AUTH_CODE || "",
			INSERT_USER: auth.USERNAME || "",
			INSERT_TIME: new Date().getTime(),
			//UPDATE_USER: auth.USER_AUTH_CODE || "",
			UPDATE_USER: auth.USERNAME || "",
			UPDATE_TIME: new Date().getTime(),

			DELETE_USER: "",
			DELETE_TIME: ""
		} );
		
		set.save()
		.then( data => {

			const setLog = new findingLogModel( {
				FINDING_CODE: CODE,
				PROSES: 'INSERT',
				PROGRESS: req.body.PROGRESS,
				IMEI: req.body.IMEI,
				SYNC_TIME: new Date(),
				SYNC_USER: auth.USERNAME
			} );

			data_header = data;

			setLog.save()
			.then( data => {
				if ( !data ) {
					res.send( {
						status: false,
						message: 'Error create data finding',
						data: {}
					} );
				}
				res.send( {
					status: true,
					message: 'Success',
					data: data_header
				} );

			} ).catch( err => {
				res.status( 500 ).send( {
					status: false,
					message: 'Some error occurred while creating data finding',
					data: {}
				} );
			} );

		} ).catch( err => {
			res.status( 500 ).send( {
				status: false,
				message: 'Some error occurred while creating data',
				data: {}
			} );
		} );
	} );
};

// Retrieve and return all notes from the database.
exports.find = ( req, res ) => {

	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		var auth = jwtDecode( req.token );

		url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;
		
		url_query.DELETE_USER = "";
		url_query.DELETE_TIME = "";

		findingModel.find( url_query )
		.then( data => {
			if( !data ) {
				return res.status( 404 ).send( {
					status: false,
					message: 'Data not found 2',
					data: {}
				} );
			}
			res.send( {
				status: true,
				message: 'Success',
				data: data
			} );
		} ).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.status( 404 ).send( {
					status: false,
					message: 'Data not found 1',
					data: {}
				} );
			}
			return res.status( 500 ).send( {
				status: false,
				message: 'Error retrieving data',
				data: {}
			} );
		} );
	} );

};

// Find a single data with a ID
exports.findOne = ( req, res ) => {
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		var auth = jwtDecode( req.token );

		findingModel.findOne( { 
			FINDING_CODE : req.params.id,
			DELETE_USER: "",
			DELETE_TIME: ""
		} ).then( data => {
			if( !data ) {
				return res.status(404).send({
					status: false,
					message: "Data not found 2 with id " + req.params.id,
					data: data,
				});
			}
			res.send( {
				status: true,
				message: 'Success',
				data: data
			} );
		} ).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.status( 404 ).send({
					status: false,
					message: "Data not found 1 with id " + req.params.id,
					data: {}
				});
			}
			return res.status( 500 ).send({
				status: false,
				message: "Error retrieving Data with id " + req.params.id,
				data: {}
			} );
		} );
	} );
};

// Update single data with ID
exports.update = ( req, res ) => {

	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		// Validation
		if( !req.body.WERKS || !req.body.AFD_CODE || !req.body.BLOCK_CODE ) {
			return res.status( 400 ).send({
				status: false,
				message: 'Invalid input',
				data: {}
			});
		}

		var auth = jwtDecode( req.token );
		console.log( auth );
		
		findingModel.findOneAndUpdate( { 
			FINDING_CODE : req.params.id 
		}, {
			WERKS: req.body.WERKS || "",
			BLOCK_CODE: req.body.BLOCK_CODE || "",
			FINDING_CATEGORY: req.body.FINDING_CATEGORY || "",
			FINDING_DESC: req.body.FINDING_DESC || "",
			FINDING_PRIORITY: req.body.FINDING_PRIORITY || "",
			DUE_DATE: req.body.DUE_DATE || "",
			ASSIGN_TO: req.body.ASSIGN_TO || "",
			PROGRESS: req.body.PROGRESS || "",
			LAT_FINDING: req.body.LAT_FINDING || "",
			LONG_FINDING: req.body.LONG_FINDING || "",
			REFFERENCE_INS_CODE: req.body.REFFERENCE_INS_CODE || ""
			
		}, { new: true } )
		.then( data => {
			if( !data ) {
				return res.status( 404 ).send( {
					status: false,
					message: "Data not found 1 with id " + req.params.id,
					data: {}
				} );
			}

		
			const setLog = new findingLogModel( {
				FINDING_CODE: req.params.id,
				PROSES: 'UPDATE',
				PROGRESS: req.body.PROGRESS,
				IMEI: req.body.IMEI,
				SYNC_TIME: new Date(),
				SYNC_USER: auth.USERNAME
			} );

			setLog.save()
			.then( data => {
				if ( !data ) {
					res.send( {
					status: false,
					message: 'Error',
					data: {}
				} );
				}
				res.send( {
					status: true,
					message: 'Success',
					data: {}
				} );

			} ).catch( err => {
				res.status( 500 ).send( {
					status: false,
					message: 'Some error occurred while creating data finding',
					data: {}
				} );
			} );


			res.send( {
					status: true,
					message: 'Success',
					data: {}
				} );
			
		}).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.status( 404 ).send( {
					status: false,
					message: "Data not found 2 with id " + req.params.id,
					data: {}
				} );
			}
			return res.status( 500 ).send( {
				status: false,
				message: "Data error updating with id " + req.params.id,
				data: {}
			} );
		});
	});
};



// Delete data with the specified ID in the request
exports.delete = ( req, res ) => {
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {

		var auth = jwtDecode( req.token );

		findingModel.findOneAndUpdate( { 
			FINDING_CODE : req.params.id 
		}, {
			DELETE_USER: auth.USERNAME,
			DELETE_TIME: new Date().getTime()
			
		}, { new: true } )
		.then( data => {
			if( !data ) {
				return res.status( 404 ).send( {
					status: false,
					message: "Data not found 1 with id " + req.params.id,
					data: {}
				} );
			}

			const setLog = new findingLogModel( {
				FINDING_CODE: req.params.id,
				PROSES: 'DELETE',
				PROGRESS: '',
				IMEI: req.body.IMEI,
				SYNC_TIME: new Date(),
				SYNC_USER: auth.USERNAME
			} );

			setLog.save()
			.then( data => {
				if ( !data ) {
					res.send( {
					status: false,
					message: 'Error',
					data: {}
				} );
				}
				res.send( {
					status: true,
					message: 'Success',
					data: {}
				} );

			} ).catch( err => {
				res.status( 500 ).send( {
					status: false,
					message: 'Some error occurred while deleting data',
					data: {}
				} );
			} );
			
		}).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.status( 404 ).send( {
					status: false,
					message: "Data not found 1 with id " + req.params.id,
					data: {}
				} );
			}
			return res.status( 500 ).send( {
				status: false,
				message: "Could not delete data with id " + req.params.id,
				data: {}
			} );
		});
	});
};

// Delete data with the specified ID in the request
/*
exports.delete = ( req, res ) => {
	findingModel.findOneAndRemove( { FINDING_CODE : req.params.id } )
	.then( data => {
		if( !data ) {
			return res.status( 404 ).send( {
				status: false,
				message: "Data not found 2 with id " + req.params.id,
				data: {}
			} );
		}
		res.send( {
			status: true,
			message: 'Success',
			data: {}
		} );
	}).catch( err => {
		if( err.kind === 'ObjectId' || err.name === 'NotFound' ) {
			return res.status(404).send({
				status: false,
				message: "Data not found 1 with id " + req.params.id,
				data: {}
			} );
		}
		return res.status( 500 ).send( {
			status: false,
			message: "Could not delete data with id " + req.params.id,
			data: {}
		} );
	} );
};
*/