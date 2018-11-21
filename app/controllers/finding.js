const findingModel = require( '../models/finding.js' );
const findingLogModel = require( '../models/findingLog.js' );

// Create and Save new Data
exports.create = ( req, res ) => {

	if( !req.body.FINDING_CODE || !req.body.WERKS || !req.body.AFD_CODE || !req.body.BLOCK_CODE ) {
		return res.status( 400 ).send({
			status: false,
			message: 'Invalid input',
			data: {}
		});
	}

	const set = new findingModel( {
		FINDING_CODE: req.body.FINDING_CODE || "",
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
		INSERT_USER: req.body.INSERT_USER || "",
		INSERT_TIME: req.body.INSERT_TIME || "",
		UPDATE_USER: req.body.UPDATE_USER || "",
		UPDATE_TIME: req.body.UPDATE_TIME || "",
		DELETE_USER: req.body.DELETE_USER || "",
		DELETE_TIME: req.body.DELETE_TIME || ""
	} );
	
	set.save()
	.then( data => {

		const setLog = new findingLogModel( {
			FINDING_CODE: req.body.FINDING_CODE,
			PROSES: 'INSERT',
			PROGRESS: req.body.PROGRESS,
			IMEI: req.body.IMEI,
			SYNC_TIME: new Date(),
			SYNC_USER: req.body.INSERT_USER
		} );

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
				data: {}
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
};

// Retrieve and return all notes from the database.
exports.find = ( req, res ) => {

	url_query = req.query;
	var url_query_length = Object.keys( url_query ).length;
	
	if ( url_query_length > 0 ) {

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
	}
	else {
		findingModel.find()
		.then( data => {
			res.send( {
				status: true,
				message: 'Success',
				data: data
			} );
		} ).catch( err => {
			res.status( 500 ).send( {
				status: false,
				message: err.message || "Some error occurred while retrieving data.",
				data: {}
			} );
		} );
	}

};

// Find a single data with a ID
exports.findOne = ( req, res ) => {
	findingModel.findOne( { 
		FINDING_CODE: req.params.id 
	} ).then( data => {
		if( !data ) {
			return res.status(404).send({
				status: false,
				message: "Data not found 2 with id " + req.params.id,
				data: {}
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
};

// Update single data with ID
exports.update = ( req, res ) => {

	// Validation
	if( !req.body.FINDING_CODE || !req.body.WERKS || !req.body.AFD_CODE || !req.body.BLOCK_CODE ) {
		return res.status( 400 ).send({
			status: false,
			message: 'Invalid input',
			data: {}
		});
	}
	
	findingModel.findOneAndUpdate( { 
		FINDING_CODE : req.params.id 
	}, {
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
		INSERT_USER: req.body.INSERT_USER || "",
		INSERT_TIME: new Date(),
		UPDATE_USER: req.body.INSERT_USER || "",
		UPDATE_TIME: new Date(),
	}, { new: true } )
	.then( data => {
		if( !data ) {
			return res.status( 404 ).send( {
				status: false,
				message: "Data not found 1 with id " + req.params.id,
				data: {}
			} );
		}
		res.send( {
			status: true,
			message: 'Success',
			data: data
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
};

// Delete data with the specified ID in the request
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