/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 
 	// Models
	const FindingModel = require( _directory_base + '/app/v1.0/Http/Models/Finding.js' );
	const FindingLogModel = require( _directory_base + '/app/v1.0/Http/Models/FindingLog.js' );

	// Node Module
	const Validator = require( 'ferds-validator');

	// Libraries
	const HelperLib = require( _directory_base + '/app/v1.0/Http/Libraries/HelperLib.js' );

/*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/** 
 	  * Create Or Update
	  * Untuk membuat data finding baru, jika data (berdasarkan finding code)
	  * sudah terbentuk maka akan mengupdate data.
	  * --------------------------------------------------------------------
	*/
	exports.create_or_update = async ( req, res ) => {
		
		// Rule Validasi
		var rules = [
			{ "name": "FINDING_CODE", "value": req.body.FINDING_CODE, "rules": "required|alpha_numeric" },
			{ "name": "WERKS", "value": req.body.WERKS, "rules": "required|numeric" },
			{ "name": "AFD_CODE", "value": req.body.AFD_CODE, "rules": "required|alpha_numeric" },
			{ "name": "BLOCK_CODE", "value": req.body.BLOCK_CODE, "rules": "required|alpha_numeric" },
			{ "name": "FINDING_CATEGORY", "value": req.body.FINDING_CATEGORY, "rules": "required|alpha_numeric" },
			{ "name": "FINDING_DESC", "value": req.body.FINDING_DESC, "rules": "required" },
			{ "name": "FINDING_PRIORITY", "value": req.body.FINDING_PRIORITY, "rules": "required|alpha" },
			{ "name": "PROGRESS", "value": req.body.PROGRESS, "rules": "required|numeric" },
			{ "name": "LAT_FINDING", "value": parseFloat( req.body.LAT_FINDING ), "rules": "required|latitude" },
			{ "name": "LONG_FINDING", "value": parseFloat( req.body.LONG_FINDING ), "rules": "required|longitude" },
			{ "name": "INSERT_USER", "value": req.body.INSERT_USER, "rules": "required|alpha_numeric" },
			//{ "name": "INSERT_TIME", "value": req.body.INSERT_TIME.toString(), "rules": "required|exact_length(14)|numeric" }
		];
		var run_validator = Validator.run( rules );
		console.log( run_validator );

		if ( run_validator.status == false ) {
			res.json( {
				status: false,
				message: "Error! Periksa kembali inputan anda.",
				data: []
			} );
		}
		else {
			var auth = req.auth;
			var check = await FindingModel
				.find( {
					FINDING_CODE : req.body.FINDING_CODE
				} )
				.select( {
					_id: 0,
					FINDING_CODE: 1
				} );

			// Jika sudah terdapat data, maka akan mengupdate Data Finding.
			if ( check.length > 0 ) {
				FindingModel.findOneAndUpdate( { 
					FINDING_CODE : req.body.FINDING_CODE
				}, {
					WERKS: req.body.WERKS || "",
					BLOCK_CODE: req.body.BLOCK_CODE || "",
					FINDING_CATEGORY: req.body.FINDING_CATEGORY || "",
					FINDING_DESC: req.body.FINDING_DESC || "",
					FINDING_PRIORITY: req.body.FINDING_PRIORITY || "",
					//DUE_DATE: Number( req.body.DUE_DATE ) || 0,
					DUE_DATE: ( req.body.DUE_DATE == "" ) ? 0 : HelperLib.date_format( req.body.DUE_DATE, 'YYYYMMDDhhmmss' ),
					ASSIGN_TO: req.body.ASSIGN_TO || "",
					PROGRESS: req.body.PROGRESS || "",
					LAT_FINDING: req.body.LAT_FINDING || "",
					LONG_FINDING: req.body.LONG_FINDING || "",
					REFFERENCE_INS_CODE: req.body.REFFERENCE_INS_CODE || "",
					UPDATE_USER: req.body.UPDATE_USER,
					UPDATE_TIME: req.body.UPDATE_TIME
				}, { new: true } )
				.then( data => {
					if ( !data ) {
						return res.send( {
							status: false,
							message: config.app.error_message.put_404,
							data: {}
						} );
					}
					
					// Insert Finding Log
					const set_log = new FindingLogModel( {
						FINDING_CODE: req.body.FINDING_CODE,
						PROSES: 'UPDATE',
						PROGRESS: req.body.PROGRESS,
						IMEI: auth.IMEI,
						SYNC_TIME: req.body.INSERT_TIME || 0,
						SYNC_USER: req.body.INSERT_USER,
					} );

					set_log.save()
					.then( data_log => {
						if ( !data_log ) {
							return res.send( {
								status: false,
								message: config.app.error_message.create_404 + ' - Log',
								data: {}
							} );
						}
						res.send( {
							status: true,
							message: config.app.error_message.put_200 + 'Data berhasil diupdate.',
							data: {}
						} );
					} ).catch( err => {
						res.send( {
							status: false,
							message: config.app.error_message.create_500 + ' - 2',
							data: {}
						} );
					} );
				} ).catch( err => {
					res.send( {
						status: false,
						message: config.app.error_message.put_500,
						data: {}
					} );
				} );
			}
			// Insert Data Finding
			else {
				const set_data = new FindingModel( {
					FINDING_CODE: req.body.FINDING_CODE || "",
					WERKS: req.body.WERKS || "",
					AFD_CODE: req.body.AFD_CODE || "",
					BLOCK_CODE: req.body.BLOCK_CODE || "",
					FINDING_CATEGORY: req.body.FINDING_CATEGORY || "",
					FINDING_DESC: req.body.FINDING_DESC || "",
					FINDING_PRIORITY: req.body.FINDING_PRIORITY || "",
					//DUE_DATE: req.body.DUE_DATE || 0,
					DUE_DATE: HelperLib.date_format( req.body.DUE_DATE, 'YYYYMMDDhhmmss' ),
					ASSIGN_TO: req.body.ASSIGN_TO || "",
					PROGRESS: req.body.PROGRESS || "",
					LAT_FINDING: req.body.LAT_FINDING || "",
					LONG_FINDING: req.body.LONG_FINDING || "",
					REFFERENCE_INS_CODE: req.body.REFFERENCE_INS_CODE || "",
					INSERT_USER: req.body.INSERT_USER,
					INSERT_TIME: req.body.INSERT_TIME || 0,
					UPDATE_USER: req.body.UPDATE_USER,
					UPDATE_TIME: req.body.UPDATE_TIME || 0,
					DELETE_USER: "",
					DELETE_TIME: 0
				} );

				set_data.save()
				.then( data => {
					if ( !data ) {
						return res.send( {
							status: false,
							message: config.app.error_message.create_404,
							data: {}
						} );
					}
					// Insert Finding Log
					const set_log = new FindingLogModel( {
						FINDING_CODE: req.body.FINDING_CODE,
						PROSES: 'INSERT',
						PROGRESS: req.body.PROGRESS,
						IMEI: auth.IMEI,
						SYNC_TIME: HelperLib.date_format( req.body.INSERT_TIME, 'YYYYMMDDhhmmss' ),
						SYNC_USER: req.body.INSERT_USER,
					} );

					set_log.save()
					.then( data_log => {
						if ( !data_log ) {
							return res.send( {
								status: false,
								message: config.app.error_message.create_404 + ' - Log',
								data: {}
							} );
						}
						res.send( {
							status: true,
							message: config.app.error_message.create_200,
							data: {}
						} );
					} ).catch( err => {
						res.send( {
							status: false,
							message: config.app.error_message.create_500 + ' - 2',
							data: {}
						} );
					} );
				} ).catch( err => {
					res.send( {
						status: false,
						message: config.app.error_message.create_500,
						data: {}
					} );
				} );
			}
		}
	};

	/** 
 	  * Find
	  * Untuk mengambil data finding berdasarkan location code yang diperoleh
	  * dari token yang dikirimkan.
	  * --------------------------------------------------------------------
	*/
	exports.find = ( req, res ) => {
		var auth = req.auth;
		var location_code_group = String( auth.LOCATION_CODE ).split( ',' );
		var ref_role = auth.REFFERENCE_ROLE;
		var location_code_final = [];
		var query_search = [];
		var afd_code = [];

		if ( ref_role != 'ALL' ) {
			location_code_group.forEach( function( data ) {
				switch ( ref_role ) {
					case 'REGION_CODE':
						location_code_final.push( data.substr( 1, 1 ) );
					break;
					case 'COMP_CODE':
						location_code_final.push( data.substr( 0, 2 ) );
					break;
					case 'AFD_CODE':
						location_code_final.push( data );
					break;
					case 'BA_CODE':
						location_code_final.push( data.substr( 0, 4 ) );
					break;
				}
			} );
		}

		switch ( ref_role ) {
			case 'REGION_CODE':
				location_code_final.forEach( function( q ) {
					query_search.push( new RegExp( '^' + q.substr( 0, 1 ) ) );
				} );
			break;
			case 'COMP_CODE':
				location_code_final.forEach( function( q ) {
					query_search.push( new RegExp( '^' + q.substr( 0, 2 ) ) );
				} );
			break;
			case 'AFD_CODE':
				location_code_final.forEach( function( q ) {
					query_search.push( new RegExp( '^' + q.substr( 0, 4 ) ) )
					afd_code = q.substr( 4, 10 );
				} );
			break;
			case 'BA_CODE':
				location_code_final.forEach( function( q ) {
					query_search.push( q );
				} );
			break;
		
		}

		if ( ref_role == 'NATIONAL' ) {
			var qs = {
				DELETE_USER: ""
			}
		}
		else {
			var qs = {
				DELETE_USER: "",
				WERKS: query_search
			}
		}

		FindingModel.find( qs )
		.select( {
			_id: 0,
			DELETE_USER: 0,
			DELETE_TIME: 0,
			__v: 0
		} )
		.sort({
			INSERT_TIME: -1
		})
		.then( data => {

			console.log(data);
			if( !data ) {
				return res.send( {
					status: false,
					message: config.app.error_message.find_404,
					data: {}
				} );
			}

			var results = [];
			data.forEach( function( result ) {
				results.push( {
					FINDING_CODE: result.FINDING_CODE,
					WERKS: result.WERKS,
					AFD_CODE: result.AFD_CODE,
					BLOCK_CODE: result.BLOCK_CODE,
					FINDING_CATEGORY: result.FINDING_CATEGORY,
					FINDING_DESC: result.FINDING_DESC,
					FINDING_PRIORITY: result.FINDING_PRIORITY,
					DUE_DATE: HelperLib.date_format( String( result.DUE_DATE ), 'YYYY-MM-DD hh-mm-ss' ),
					//DUE_DATE: Number( result.INSERT_TIME ),
					//DUE_DATE: Number( data.DUE_DATE ) || 0,
					STATUS: HelperLib.status_finding( result.PROGRESS ),
					ASSIGN_TO: result.ASSIGN_TO,
					//PROGRESS: result.PROGRESS,
					PROGRESS: Number( result.PROGRESS ),
					LAT_FINDING: result.LAT_FINDING,
					LONG_FINDING: result.LONG_FINDING,
					REFFERENCE_INS_CODE: result.REFFERENCE_INS_CODE,
					INSERT_USER: result.INSERT_USER,
					INSERT_TIME: HelperLib.date_format( String( result.INSERT_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
					UPDATE_USER: result.UPDATE_USER || '',
					UPDATE_TIME: HelperLib.date_format( String( result.UPDATE_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
					STATUS_SYNC: "Y"
					//INSERT_TIME: HelperLib.date_format( String( result.INSERT_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
				} );
			} );

			res.send( {
				status: true,
				message: config.app.error_message.find_200,
				data: results
			} );
		} ).catch( err => {
			res.send( {
				status: false,
				message: config.app.error_message.find_500,
				data: {}
			} );
		} );
	};

	/** 
 	  * Find All/Query
	  * Untuk mengambil data finding berdasarkan URL query. Contohnya :
	  * http://URL.DOMAIN/finding/q?WERKS=4421&FINDING_CODE=ABC123
	  * Jika URL query tidak diisi, maka akan menampilkan seluruh data.
	  * --------------------------------------------------------------------
	*/
	exports.findAll = ( req, res ) => {
		var url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;
		var query = {};
			query.DELETE_USER = "";

		if ( req.query.WERKS ) {
			var length_werks = String( req.query.WERKS ).length;

			if ( length_werks < 4 ) {
				query.WERKS = new RegExp( '^' + req.query.WERKS );
			}
			else {
				query.WERKS = req.query.WERKS;
			}
		}

		if ( req.query.AFD_CODE ) {
			query.AFD_CODE = req.query.AFD_CODE;
		}

		if ( req.query.BLOCK_CODE ) {
			query.BLOCK_CODE = req.query.BLOCK_CODE;
		}

		FindingModel.find( 
			query 
		)
		.select( {
			_id: 0,
			__v: 0
		} )
		.then( data => {
			if( !data ) {
				return res.send( {
					status: false,
					message: config.app.error_message.find_404,
					data: {}
				} );
			}
			var results = [];
			data.forEach( function( result ) {
				results.push( {
					FINDING_CODE: result.FINDING_CODE,
					WERKS: result.WERKS,
					AFD_CODE: result.AFD_CODE,
					BLOCK_CODE: result.BLOCK_CODE,
					FINDING_CATEGORY: result.FINDING_CATEGORY,
					FINDING_DESC: result.FINDING_DESC,
					FINDING_PRIORITY: result.FINDING_PRIORITY,
					DUE_DATE: HelperLib.date_format( String( result.DUE_DATE ), 'YYYY-MM-DD hh-mm-ss' ),
					STATUS: HelperLib.status_finding( result.PROGRESS ),
					ASSIGN_TO: result.ASSIGN_TO,
					PROGRESS: result.PROGRESS,
					LAT_FINDING: result.LAT_FINDING,
					LONG_FINDING: result.LONG_FINDING,
					REFFERENCE_INS_CODE: result.REFFERENCE_INS_CODE,
					INSERT_USER: result.INSERT_USER,
					INSERT_TIME: HelperLib.date_format( String( result.INSERT_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
					UPDATE_USER: result.UPDATE_USER,
					UPDATE_TIME: HelperLib.date_format( String( result.UPDATE_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
				} );
			} );

			res.send( {
				status: true,
				message: config.app.error_message.find_200,
				data: results
			} );
		} ).catch( err => {
			res.send( {
				status: false,
				message: config.app.error_message.find_500,
				data: {}
			} );
		} );
	};

	/** 
 	  * Find One
	  * Untuk mengambil saty row data Finding berdasarkan Finding Code. 
	  * --------------------------------------------------------------------
	*/
	exports.findOne = ( req, res ) => {

		FindingModel.findOne( { 
			FINDING_CODE : req.params.id,
			DELETE_USER: ""
		} )
		.select( {
			_id: 0,
			DELETE_USER: 0,
			DELETE_TIME: 0,
			__v: 0
		} )
		.then( data => {
			if( !data ) {
				return res.send( {
					status: false,
					message: config.app.error_message.find_404,
					data: {}
				} );
			}
			var rowdata = {
				FINDING_CODE: data.FINDING_CODE,
				WERKS: data.WERKS,
				AFD_CODE: data.AFD_CODE,
				BLOCK_CODE: data.BLOCK_CODE,
				FINDING_CATEGORY: data.FINDING_CATEGORY,
				FINDING_DESC: data.FINDING_DESC,
				FINDING_PRIORITY: data.FINDING_PRIORITY,
				DUE_DATE: HelperLib.date_format( String( data.DUE_DATE ), 'YYYY-MM-DD hh-mm-ss' ),
				STATUS: HelperLib.status_finding( data.PROGRESS ),
				ASSIGN_TO: data.ASSIGN_TO,
				PROGRESS: Number( data.PROGRESS ),
				LAT_FINDING: data.LAT_FINDING,
				LONG_FINDING: data.LONG_FINDING,
				REFFERENCE_INS_CODE: data.REFFERENCE_INS_CODE,
				INSERT_USER: data.INSERT_USER,
				INSERT_TIME: HelperLib.date_format( String( data.INSERT_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
				STATUS_SYNC: "Y"
			};
			res.send( {
				status: true,
				message: config.app.error_message.find_200,
				data: rowdata
			} );
		} ).catch( err => {
			res.send( {
				status: false,
				message: config.app.error_message.find_500,
				data: {}
			} );
		} );
	};
