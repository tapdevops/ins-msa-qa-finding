/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Models
	const FindingModel = require( _directory_base + '/app/models/v1.0/Finding.js' );
	const FindingLogModel = require( _directory_base + '/app/models/v1.0/FindingLog.js' );

	// Node Module
	const validator = require( 'ferds-validator');

	// Libraries
	const DateLib = require( _directory_base + '/app/libraries/v1.0/DateLib.js' );
	const StatusFindingLib = require( _directory_base + '/app/libraries/v1.0/StatusFindingLib.js' );

/*
 |--------------------------------------------------------------------------
 | Create
 |--------------------------------------------------------------------------
 |
 | Untuk membuat data finding baru.
 |
 */
	exports.create = async ( req, res ) => {
		console.log( 'Create' );
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
			{ "name": "INSERT_TIME", "value": req.body.INSERT_TIME.toString(), "rules": "required|exact_length(14)|numeric" }
		];

		var run_validator = validator.run( rules );
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

			// Update Data Finding
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
					DUE_DATE: ( req.body.DUE_DATE == "" ) ? 0 : DateLib.convert( req.body.DUE_DATE, 'YYYYMMDDhhmmss' ),
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
					DUE_DATE: DateLib.convert( req.body.DUE_DATE, 'YYYYMMDDhhmmss' ),
					ASSIGN_TO: req.body.ASSIGN_TO || "",
					PROGRESS: req.body.PROGRESS || "",
					LAT_FINDING: req.body.LAT_FINDING || "",
					LONG_FINDING: req.body.LONG_FINDING || "",
					REFFERENCE_INS_CODE: req.body.REFFERENCE_INS_CODE || "",
					INSERT_USER: req.body.INSERT_USER,
					INSERT_TIME: req.body.INSERT_TIME || 0,
					UPDATE_USER: "",
					UPDATE_TIME: 0,
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
						SYNC_TIME: DateLib.convert( req.body.INSERT_TIME, 'YYYYMMDDhhmmss' ),
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

/*
 |--------------------------------------------------------------------------
 | Find
 |--------------------------------------------------------------------------
 |
 | Untuk mengambil data berdasarkan otorisasi dari token yang dilempar.
 |
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
			UPDATE_USER: 0,
			UPDATE_TIME: 0,
			DELETE_USER: 0,
			DELETE_TIME: 0,
			__v: 0
		} )
		.sort({
			INSERT_TIME: -1
		})
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
					DUE_DATE: DateLib.convert( String( result.DUE_DATE ), 'YYYY-MM-DD hh-mm-ss' ),
					//DUE_DATE: Number( result.INSERT_TIME ),
					//DUE_DATE: Number( data.DUE_DATE ) || 0,
					STATUS: StatusFindingLib.set( result.PROGRESS ),
					ASSIGN_TO: result.ASSIGN_TO,
					//PROGRESS: result.PROGRESS,
					PROGRESS: Number( result.PROGRESS ),
					LAT_FINDING: result.LAT_FINDING,
					LONG_FINDING: result.LONG_FINDING,
					REFFERENCE_INS_CODE: result.REFFERENCE_INS_CODE,
					INSERT_USER: result.INSERT_USER,
					//INSERT_TIME: DateLib.convert( String( result.INSERT_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
					INSERT_TIME: data.INSERT_TIME,
					STATUS_SYNC: "Y"
					//INSERT_TIME: DateLib.convert( String( result.INSERT_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
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

/*
 |--------------------------------------------------------------------------
 | Find All
 |--------------------------------------------------------------------------
 |
 | Untuk mengambil data berdasarkan otorisasi dari token yang dilempar.
 |
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
					DUE_DATE: DateLib.convert( String( result.DUE_DATE ), 'YYYY-MM-DD hh-mm-ss' ),
					STATUS: StatusFindingLib.set( result.PROGRESS ),
					ASSIGN_TO: result.ASSIGN_TO,
					PROGRESS: result.PROGRESS,
					LAT_FINDING: result.LAT_FINDING,
					LONG_FINDING: result.LONG_FINDING,
					REFFERENCE_INS_CODE: result.REFFERENCE_INS_CODE,
					INSERT_USER: result.INSERT_USER,
					INSERT_TIME: DateLib.convert( String( result.INSERT_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
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

/*
 |--------------------------------------------------------------------------
 | Find One
 |--------------------------------------------------------------------------
 |
 | Untuk menampilkan data berdasarkan TR_CODE.
 |
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
				DUE_DATE: DateLib.convert( String( data.DUE_DATE ), 'YYYY-MM-DD hh-mm-ss' ),
				STATUS: StatusFindingLib.set( data.PROGRESS ),
				ASSIGN_TO: data.ASSIGN_TO,
				PROGRESS: Number( data.PROGRESS ),
				LAT_FINDING: data.LAT_FINDING,
				LONG_FINDING: data.LONG_FINDING,
				REFFERENCE_INS_CODE: data.REFFERENCE_INS_CODE,
				INSERT_USER: data.INSERT_USER,
				INSERT_TIME: DateLib.convert( String( data.INSERT_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
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

/*
 |--------------------------------------------------------------------------
 | Find Report
 |--------------------------------------------------------------------------
 |
 | Untuk memberi data report pada web berdasarkan range terakhir melakukan 
 | synchronize ke server. Contohnya, User A terakhir melakukan sync tanggal 
 | 26 Maret 2019, dan hari ini, tanggal 30 April 2019, dia kembali melakukan 
 | sync, maka range data yang diambil adalah mulai dari tanggal 26 Maret 2019 
 | sampai dengan 30 April 2019. Juga bisa digabungkan dengan BA_CODE, AFD_CODE, 
 | dan lain-lain. Contoh penggunaan URLnya adalah : 
 | http://APP_URL/?WERKS=4421&START_DATE=20190124000000&END_DATE=20190725000000
 |
 */
 	exports.findReport = async ( req, res ) => {

		var url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;
		var query = {};
			query.DELETE_USER = "";

		// Find By Region Code
		if ( req.query.REGION_CODE && !req.query.COMP_CODE ) {
			var results = await FindingModel.find( {
				WERKS: new RegExp( '^' + req.query.REGION_CODE.substr( 1, 2 ) ),
				INSERT_TIME: {
					$gte: Number( req.query.START_DATE ),
					$lte: Number( req.query.END_DATE )
				}
			} );
		}

		// Find By Comp Code
		if ( req.query.COMP_CODE && !req.query.WERKS ) {
			console.log( 'Find By Comp Code' );
			var results = await FindingModel.find( {
				WERKS: new RegExp( '^' + req.query.COMP_CODE.substr( 0, 2 ) ),
				INSERT_TIME: {
					$gte: Number( req.query.START_DATE ),
					$lte: Number( req.query.END_DATE )
				}
			} );
		}

		// Find By BA Code / WERKS
		if ( req.query.WERKS && !req.query.AFD_CODE ) {
			console.log( 'Find By BA Code / WERKS' );
			var results = await FindingModel.find( {
				WERKS: new RegExp( '^' + req.query.WERKS.substr( 0, 4 ) ),
				INSERT_TIME: {
					$gte: Number( req.query.START_DATE ),
					$lte: Number( req.query.END_DATE )
				}
			} );
		}

		// Find By AFD Code
		if ( req.query.AFD_CODE && req.query.WERKS && !req.query.BLOCK_CODE ) {
			console.log( 'Find By AFD Code' );
			var results = await FindingModel.find( {
				WERKS: req.query.WERKS,
				AFD_CODE: req.query.AFD_CODE,
				INSERT_TIME: {
					$gte: Number( req.query.START_DATE ),
					$lte: Number( req.query.END_DATE )
				}
			} );
		}

		// Find By Block Code
		if ( req.query.BLOCK_CODE && req.query.AFD_CODE && req.query.WERKS ) {
			console.log( 'Find By Block Code' );
			var results = await FindingModel.find( {
				WERKS: req.query.WERKS,
				AFD_CODE: req.query.AFD_CODE,
				BLOCK_CODE: req.query.BLOCK_CODE,
				INSERT_TIME: {
					$gte: Number( req.query.START_DATE ),
					$lte: Number( req.query.END_DATE )
				}
			} );
		}

		if ( results.length > 0 ) {
			var set_data = [];
			results.forEach( function( result ) {
				set_data.push( {
					FINDING_CODE: result.FINDING_CODE,
					WERKS: result.WERKS,
					AFD_CODE: result.AFD_CODE,
					BLOCK_CODE: result.BLOCK_CODE,
					FINDING_CATEGORY: result.FINDING_CATEGORY,
					FINDING_DESC: result.FINDING_DESC,
					FINDING_PRIORITY: result.FINDING_PRIORITY,
					DUE_DATE: DateLib.convert( String( result.DUE_DATE ), 'YYYY-MM-DD hh-mm-ss' ),
					STATUS: StatusFindingLib.set( result.PROGRESS ),
					ASSIGN_TO: result.ASSIGN_TO,
					PROGRESS: result.PROGRESS,
					LAT_FINDING: result.LAT_FINDING,
					LONG_FINDING: result.LONG_FINDING,
					REFFERENCE_INS_CODE: result.REFFERENCE_INS_CODE,
					INSERT_USER: result.INSERT_USER,
					INSERT_TIME: DateLib.convert( String( result.INSERT_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
					UPDATE_USER: result.UPDATE_USER,
					UPDATE_TIME: DateLib.convert( String( result.UPDATE_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
				} );
			} );
			res.send( {
				status: true,
				message: config.app.error_message.find_200,
				data: set_data
			} );
		}
		else {
			return res.send( {
				status: true,
				message: config.app.error_message.find_200,
				data: {}
			} );
		}
	};

/*
 |--------------------------------------------------------------------------
 | Sync Mobile Images
 |--------------------------------------------------------------------------
 |
 | Untuk memberi data pada mobile berdasarkan range terakhir melakukan 
 | synchronize ke server. Contohnya, User A terakhir melakukan sync 
 | tanggal 26 Maret 2019, dan hari ini, tanggal 30 April 2019, dia kembali 
 | melakukan sync, maka range data yang diambil adalah mulai dari tanggal 
 | 26 Maret 2019 sampai dengan 30 April 2019.
 |
 */
 	exports.syncMobile = ( req, res ) => {
 		console.log( 'Sync Mobile' );
		var auth = req.auth;
		var start_date = req.params.start_date;
		var end_date = req.params.end_date;
		var location_code_group = String( auth.LOCATION_CODE ).split( ',' );
		var ref_role = auth.REFFERENCE_ROLE;
		var location_code_final = [];
		var query_search = [];
		var afd_code = '';

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
			case 'NATIONAL':
			break;
		}

		if ( ref_role == 'NATIONAL' ) {
			FindingModel.find( {
				DELETE_USER: "",
				$and: [
					{
						$or: [
							{
								INSERT_TIME: {
									$gte: start_date,
									$lte: end_date
								}
							},
							{
								UPDATE_TIME: {
									$gte: start_date,
									$lte: end_date
								}
							},
							{
								DELETE_TIME: {
									$gte: start_date,
									$lte: end_date
								}
							}
						]
					}
				]
			} )
			.select( {
				_id: 0,
				__v: 0
			} )
			.sort( {
				INSERT_TIME:-1
			} )
			.then( data_insert => {
				if( !data_insert ) {
					return res.send( {
						status: false,
						message: config.app.error_message.find_404,
						data: {}
					} );
				}

				var temp_insert = [];
				var temp_update = [];
				var temp_delete = [];
				
				data_insert.forEach( function( data ) {

					if ( data.DELETE_TIME >= start_date && data.DELETE_TIME <= end_date ) {
						temp_delete.push( {
							FINDING_CODE: data.FINDING_CODE,
							WERKS: data.WERKS,
							AFD_CODE: data.AFD_CODE,
							BLOCK_CODE: data.BLOCK_CODE,
							FINDING_CATEGORY: data.FINDING_CATEGORY,
							FINDING_DESC: data.FINDING_DESC,
							FINDING_PRIORITY: data.FINDING_PRIORITY,
							//DUE_DATE: Number( data.DUE_DATE ) || 0,
							DUE_DATE: DateLib.convert( String( data.DUE_DATE ), 'YYYY-MM-DD hh-mm-ss' ),
							STATUS: StatusFindingLib.set( String( data.PROGRESS ) ),
							ASSIGN_TO: data.ASSIGN_TO,
							PROGRESS: data.PROGRESS,
							LAT_FINDING: data.LAT_FINDING,
							LONG_FINDING: data.LONG_FINDING,
							REFFERENCE_INS_CODE: data.REFFERENCE_INS_CODE,
							INSERT_USER: data.INSERT_USER,
							//INSERT_TIME: DateLib.convert( String( data.INSERT_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
							INSERT_TIME: data.INSERT_TIME,
							STATUS_SYNC: "Y"
						} );


					}

					if ( data.INSERT_TIME >= start_date && data.INSERT_TIME <= end_date ) {
						temp_insert.push( {
							FINDING_CODE: data.FINDING_CODE,
							WERKS: data.WERKS,
							AFD_CODE: data.AFD_CODE,
							BLOCK_CODE: data.BLOCK_CODE,
							FINDING_CATEGORY: data.FINDING_CATEGORY,
							FINDING_DESC: data.FINDING_DESC,
							FINDING_PRIORITY: data.FINDING_PRIORITY,
							//DUE_DATE: Number( data.DUE_DATE ) || 0,
							DUE_DATE: DateLib.convert( String( data.DUE_DATE ), 'YYYY-MM-DD hh-mm-ss' ),
							STATUS: StatusFindingLib.set( String( data.PROGRESS ) ),
							ASSIGN_TO: data.ASSIGN_TO,
							PROGRESS: data.PROGRESS,
							LAT_FINDING: data.LAT_FINDING,
							LONG_FINDING: data.LONG_FINDING,
							REFFERENCE_INS_CODE: data.REFFERENCE_INS_CODE,
							INSERT_USER: data.INSERT_USER,
							INSERT_TIME: data.INSERT_TIME,
							STATUS_SYNC: "N"
						} );
					}

					if ( data.UPDATE_TIME >= start_date && data.UPDATE_TIME <= end_date ) {
						temp_update.push( {
							FINDING_CODE: data.FINDING_CODE,
							WERKS: data.WERKS,
							AFD_CODE: data.AFD_CODE,
							BLOCK_CODE: data.BLOCK_CODE,
							FINDING_CATEGORY: data.FINDING_CATEGORY,
							FINDING_DESC: data.FINDING_DESC,
							FINDING_PRIORITY: data.FINDING_PRIORITY,
							DUE_DATE: Number( data.DUE_DATE ) || 0,
							DUE_DATE: DateLib.convert( String( data.DUE_DATE ), 'YYYY-MM-DD hh-mm-ss' ),
							STATUS: StatusFindingLib.set( String( data.PROGRESS ) ),
							ASSIGN_TO: data.ASSIGN_TO,
							PROGRESS: data.PROGRESS,
							LAT_FINDING: data.LAT_FINDING, 
							LONG_FINDING: data.LONG_FINDING,
							REFFERENCE_INS_CODE: data.REFFERENCE_INS_CODE,
							INSERT_USER: data.INSERT_USER,
							INSERT_TIME: data.INSERT_TIME,
							STATUS_SYNC: "Y"
						} );
					}

				} );

				res.json( {
					status: true,
					message: 'Data Sync tanggal ' + DateLib.convert( start_date, 'YYYY-MM-DD hh-mm-ss' ) + ' s/d ' + DateLib.convert( end_date, 'YYYY-MM-DD hh-mm-ss' ),
					data: {
						"hapus": temp_delete,
						"simpan": temp_insert,
						"ubah": temp_update,
					}
				} );
			} ).catch( err => {
				res.send( {
					status: false,
					message: config.app.error_message.find_500,
					data: {}
				} );
			} );
		}
		else if ( ref_role == 'AFD_CODE' ) {
			FindingModel.find( {
				DELETE_USER: "",
				WERKS: query_search,
				AFD_CODE: afd_code,
				$and: [
					{
						$or: [
							{
								INSERT_TIME: {
									$gte: start_date,
									$lte: end_date
								}
							},
							{
								UPDATE_TIME: {
									$gte: start_date,
									$lte: end_date
								}
							},
							{
								DELETE_TIME: {
									$gte: start_date,
									$lte: end_date
								}
							}
						]
					}
				]
			} )
			.select( {
				_id: 0,
				__v: 0
			} )
			.sort( {
				INSERT_TIME:-1
			} )
			.then( data_insert => {
				if( !data_insert ) {
					return res.send( {
						status: false,
						message: config.app.error_message.find_404,
						data: {}
					} );
				}

				var temp_insert = [];
				var temp_update = [];
				var temp_delete = [];
				
				data_insert.forEach( function( data ) {

					if ( data.DELETE_TIME >= start_date && data.DELETE_TIME <= end_date ) {
						temp_delete.push( {
							FINDING_CODE: data.FINDING_CODE,
							WERKS: data.WERKS,
							AFD_CODE: data.AFD_CODE,
							BLOCK_CODE: data.BLOCK_CODE,
							FINDING_CATEGORY: data.FINDING_CATEGORY,
							FINDING_DESC: data.FINDING_DESC,
							FINDING_PRIORITY: data.FINDING_PRIORITY,
							//DUE_DATE: Number( data.DUE_DATE ) || 0,
							DUE_DATE: DateLib.convert( String( data.DUE_DATE ), 'YYYY-MM-DD hh-mm-ss' ),
							STATUS: StatusFindingLib.set( String( data.PROGRESS ) ),
							ASSIGN_TO: data.ASSIGN_TO,
							PROGRESS: data.PROGRESS,
							LAT_FINDING: data.LAT_FINDING,
							LONG_FINDING: data.LONG_FINDING,
							REFFERENCE_INS_CODE: data.REFFERENCE_INS_CODE,
							INSERT_USER: data.INSERT_USER,
							INSERT_TIME: DateLib.convert( String( data.INSERT_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
							STATUS_SYNC: "Y"
						} );


					}

					if ( data.INSERT_TIME >= start_date && data.INSERT_TIME <= end_date ) {
						temp_insert.push( {
							FINDING_CODE: data.FINDING_CODE,
							WERKS: data.WERKS,
							AFD_CODE: data.AFD_CODE,
							BLOCK_CODE: data.BLOCK_CODE,
							FINDING_CATEGORY: data.FINDING_CATEGORY,
							FINDING_DESC: data.FINDING_DESC,
							FINDING_PRIORITY: data.FINDING_PRIORITY,
							//DUE_DATE: Number( data.DUE_DATE ) || 0,
							DUE_DATE: DateLib.convert( String( data.DUE_DATE ), 'YYYY-MM-DD hh-mm-ss' ),
							STATUS: StatusFindingLib.set( String( data.PROGRESS ) ),
							ASSIGN_TO: data.ASSIGN_TO,
							PROGRESS: data.PROGRESS,
							LAT_FINDING: data.LAT_FINDING,
							LONG_FINDING: data.LONG_FINDING,
							REFFERENCE_INS_CODE: data.REFFERENCE_INS_CODE,
							INSERT_USER: data.INSERT_USER,
							INSERT_TIME: DateLib.convert( String( data.INSERT_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
							STATUS_SYNC: "N"
						} );
					}

					if ( data.UPDATE_TIME >= start_date && data.UPDATE_TIME <= end_date ) {
						temp_update.push( {
							FINDING_CODE: data.FINDING_CODE,
							WERKS: data.WERKS,
							AFD_CODE: data.AFD_CODE,
							BLOCK_CODE: data.BLOCK_CODE,
							FINDING_CATEGORY: data.FINDING_CATEGORY,
							FINDING_DESC: data.FINDING_DESC,
							FINDING_PRIORITY: data.FINDING_PRIORITY,
							DUE_DATE: Number( data.DUE_DATE ) || 0,
							DUE_DATE: DateLib.convert( String( data.DUE_DATE ), 'YYYY-MM-DD hh-mm-ss' ),
							STATUS: StatusFindingLib.set( String( data.PROGRESS ) ),
							ASSIGN_TO: data.ASSIGN_TO,
							PROGRESS: data.PROGRESS,
							LAT_FINDING: data.LAT_FINDING, 
							LONG_FINDING: data.LONG_FINDING,
							REFFERENCE_INS_CODE: data.REFFERENCE_INS_CODE,
							INSERT_USER: data.INSERT_USER,
							INSERT_TIME: DateLib.convert( String( data.INSERT_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
							STATUS_SYNC: "Y"
						} );
					}

				} );

				res.json( {
					status: true,
					message: 'Data Sync tanggal ' + DateLib.convert( start_date, 'YYYY-MM-DD hh-mm-ss' ) + ' s/d ' + DateLib.convert( end_date, 'YYYY-MM-DD hh-mm-ss' ),
					data: {
						"hapus": temp_delete,
						"simpan": temp_insert,
						"ubah": temp_update,
					}
				} );
			} ).catch( err => {
				res.send( {
					status: false,
					message: config.app.error_message.find_500,
					data: {}
				} );
			} );
		}
		else {
			FindingModel.find( {
				DELETE_USER: "",
				WERKS: query_search,
				$and: [
					{
						$or: [
							{
								INSERT_TIME: {
									$gte: start_date,
									$lte: end_date
								}
							},
							{
								UPDATE_TIME: {
									$gte: start_date,
									$lte: end_date
								}
							},
							{
								DELETE_TIME: {
									$gte: start_date,
									$lte: end_date
								}
							}
						]
					}
				]
			} )
			.select( {
				_id: 0,
				__v: 0
			} )
			.sort( {
				INSERT_TIME:-1
			} )
			.then( data_insert => {
				
				if( !data_insert ) {
					return res.send( {
						status: false,
						message: config.app.error_message.find_404,
						data: {}
					} );
				}

				//console.log( data_insert );

				var temp_insert = [];
				var temp_update = [];
				var temp_delete = [];

				//console.log(data_insert);
				
				data_insert.forEach( function( data ) {

					if ( data.DELETE_TIME >= start_date && data.DELETE_TIME <= end_date ) {
						temp_delete.push( {
							FINDING_CODE: data.FINDING_CODE,
							WERKS: data.WERKS,
							AFD_CODE: data.AFD_CODE,
							BLOCK_CODE: data.BLOCK_CODE,
							FINDING_CATEGORY: data.FINDING_CATEGORY,
							FINDING_DESC: data.FINDING_DESC,
							FINDING_PRIORITY: data.FINDING_PRIORITY,
							//DUE_DATE: Number( data.DUE_DATE ) || 0,
							DUE_DATE: DateLib.convert( String( data.DUE_DATE ), 'YYYY-MM-DD hh-mm-ss' ),
							STATUS: StatusFindingLib.set( String( data.PROGRESS ) ),
							ASSIGN_TO: data.ASSIGN_TO,
							PROGRESS: data.PROGRESS,
							LAT_FINDING: data.LAT_FINDING,
							LONG_FINDING: data.LONG_FINDING,
							REFFERENCE_INS_CODE: data.REFFERENCE_INS_CODE,
							INSERT_USER: data.INSERT_USER,
							INSERT_TIME: DateLib.convert( String( data.INSERT_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
							STATUS_SYNC: "N"
						} );
					}

					if ( data.INSERT_TIME >= start_date && data.INSERT_TIME <= end_date ) {
						//console.log(result.PROGRESS );
						temp_insert.push( {
							FINDING_CODE: data.FINDING_CODE,
							WERKS: data.WERKS,
							AFD_CODE: data.AFD_CODE,
							BLOCK_CODE: data.BLOCK_CODE,
							FINDING_CATEGORY: data.FINDING_CATEGORY,
							FINDING_DESC: data.FINDING_DESC,
							FINDING_PRIORITY: data.FINDING_PRIORITY,
							//DUE_DATE: Number( data.DUE_DATE ) || 0,
							DUE_DATE: DateLib.convert( String( data.DUE_DATE ), 'YYYY-MM-DD hh-mm-ss' ),
							STATUS: StatusFindingLib.set( String( data.PROGRESS ) ),
							ASSIGN_TO: data.ASSIGN_TO,
							PROGRESS: data.PROGRESS,
							LAT_FINDING: data.LAT_FINDING,
							LONG_FINDING: data.LONG_FINDING,
							REFFERENCE_INS_CODE: data.REFFERENCE_INS_CODE,
							INSERT_USER: data.INSERT_USER,
							INSERT_TIME: DateLib.convert( String( data.INSERT_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
							STATUS_SYNC: "N"
						} );
					}

					if ( data.UPDATE_TIME >= start_date && data.UPDATE_TIME <= end_date ) {
						temp_update.push( {
							FINDING_CODE: data.FINDING_CODE,
							WERKS: data.WERKS,
							AFD_CODE: data.AFD_CODE,
							BLOCK_CODE: data.BLOCK_CODE,
							FINDING_CATEGORY: data.FINDING_CATEGORY,
							FINDING_DESC: data.FINDING_DESC,
							FINDING_PRIORITY: data.FINDING_PRIORITY,
							//DUE_DATE: Number( data.DUE_DATE ) || 0,
							DUE_DATE: DateLib.convert( String( data.DUE_DATE ), 'YYYY-MM-DD hh-mm-ss' ),
							STATUS: StatusFindingLib.set( String( data.PROGRESS ) ),
							ASSIGN_TO: data.ASSIGN_TO,
							PROGRESS: data.PROGRESS,
							LAT_FINDING: data.LAT_FINDING, 
							LONG_FINDING: data.LONG_FINDING,
							REFFERENCE_INS_CODE: data.REFFERENCE_INS_CODE,
							INSERT_USER: data.INSERT_USER,
							INSERT_TIME: DateLib.convert( String( data.INSERT_TIME ), 'YYYY-MM-DD hh-mm-ss' ),
							STATUS_SYNC: "Y"
						} );
					}
				} );

				res.json( {
					status: true,
					message: 'Data Sync tanggal ' + DateLib.convert( start_date, 'YYYY-MM-DD hh-mm-ss' ) + ' s/d ' + DateLib.convert( end_date, 'YYYY-MM-DD hh-mm-ss' ),
					data: {
						"hapus": temp_delete,
						"simpan": temp_insert,
						"ubah": temp_update,
					}
				} );
			} ).catch( err => {
				console.log(err);
				res.send( {
					status: false,
					message: config.app.error_message.find_500,
					data: {}
				} );
			} );
		}
	};

/*
 |--------------------------------------------------------------------------
 | Sync Mobile Images
 |--------------------------------------------------------------------------
 |
 | Untuk mengambil TR_CODE dari Finding, untuk mengambil data dari MS.Images
 |
 */
	exports.syncMobileImages = async ( req, res ) => {

		var auth = req.auth;
		var start_date = req.params.start_date;
		var end_date = req.params.end_date;
		var location_code_group = String( auth.LOCATION_CODE ).split( ',' );
		var ref_role = auth.REFFERENCE_ROLE;
		var location_code_final = [];
		var query_search = [];
		var afd_code = '';

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

		if ( ref_role == 'AFD_CODE' ) {
			var query = await FindingModel
				.find( {
					DELETE_USER: "",
					WERKS: query_search,
					AFD_CODE: afd_code,
					$and: [
						{
							$or: [
								{
									INSERT_TIME: {
										$gte: start_date,
										$lte: end_date
									}
								},
								{
									UPDATE_TIME: {
										$gte: start_date,
										$lte: end_date
									}
								}
							]
						}
					]
				} )
				.select( {
					_id: 0,
					FINDING_CODE: 1,
					INSERT_TIME: 1
				} )
				.sort( {
					INSERT_TIME: -1
				} );
			
		}
		else if ( ref_role == 'NATIONAL' ) {
			var query = await FindingModel
				.find( {
					DELETE_USER: "",
					$and: [
						{
							INSERT_TIME: {
								$gte: start_date,
								$lte: end_date
							}
						},
						{
							UPDATE_TIME: {
								$gte: start_date,
								$lte: end_date
							}
						}
					]
				} )
				.select( {
					_id: 0,
					FINDING_CODE: 1,
					INSERT_TIME: 1
				} )
				.sort( {
					INSERT_TIME:-1
				} );
		}
		else {
			var query = await FindingModel
				.find( {
					DELETE_USER: "",
					WERKS: query_search,
					$and: [
						{
							$or: [
								{
									INSERT_TIME: {
										$gte: start_date,
										$lte: end_date
									}
								},
								{
									UPDATE_TIME: {
										$gte: start_date,
										$lte: end_date
									}
								}
							]
						}
					]
				} )
				.select( {
					_id: 0,
					FINDING_CODE: 1,
					INSERT_TIME: 1
				} )
				.sort( {
					INSERT_TIME:-1
				} );
		}

		if ( query.length > 0 ) {
			var results = [];
			query.forEach( function( result ) {
				results.push( String( result.FINDING_CODE ) );
			} );

			res.send( {
				status: true,
				message: config.app.error_message.find_200,
				data: results
			} );
		}
		else {
			if ( ref_role == 'AFD_CODE' ) {
				var query = await FindingModel
					.find( {
						DELETE_USER: "",
						WERKS: query_search,
						AFD_CODE: afd_code
					} )
					.select( {
						_id: 0,
						FINDING_CODE: 1,
						INSERT_TIME: 1
					} )
					.sort( {
						FINDING_CODE: -1
					} );
			}
			else if ( ref_role == 'NATIONAL' ) {
				var query = await FindingModel
					.find( {
						DELETE_USER: ""
					} )
					.select( {
						_id: 0,
						FINDING_CODE: 1,
						INSERT_TIME: 1
					} )
					.sort( {
						INSERT_TIME:-1
					} );
			}
			else {
				var query = await FindingModel
					.find( {
						DELETE_USER: "",
						WERKS: query_search
					} )
					.select( {
						_id: 0,
						FINDING_CODE: 1,
						INSERT_TIME: 1
					} )
					.sort( {
						INSERT_TIME:-1
					} );
			}

			if ( query.length > 0 ) {
				var results = [];
				query.forEach( function( result ) {
					results.push( String( result.FINDING_CODE ) );
				} );
				res.send( {
					status: true,
					message: config.app.error_message.find_200,
					data: results
				} );
			}
			else {
				res.send( {
					status: false,
					message: config.app.error_message.find_404,
					data: {}
				} );
			}
			
		}
	};