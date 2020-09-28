/*
 |--------------------------------------------------------------------------
 | Variable
 |--------------------------------------------------------------------------
 */
const Mongoose = require('mongoose');
const SchemaTypes = Mongoose.Schema.Types;

require('mongoose-double')(Mongoose);

/*
 |--------------------------------------------------------------------------
 | Schema
 |--------------------------------------------------------------------------
 */
const EBCCValidationHeaderSchema = Mongoose.Schema({
	EBCC_VALIDATION_CODE: String,
	WERKS: String,
	AFD_CODE: String,
	BLOCK_CODE: String,
	NO_TPH: String,
	STATUS_TPH_SCAN: String,
	ALASAN_MANUAL: String,
	LAT_TPH: SchemaTypes.Double,
	LON_TPH: SchemaTypes.Double,
	DELIVERY_CODE: String,
	STATUS_DELIVERY_CODE: String,
	STATUS_SYNC: String,
	SYNC_TIME: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return 0;
		}
	},
	INSERT_USER: String,
	INSERT_TIME: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return 0;
		}
	},
	UPDATE_USER: String,
	UPDATE_TIME: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return 0;
		}
	}
});

/*
 |--------------------------------------------------------------------------
 | Module Exports
 |--------------------------------------------------------------------------
 */
module.exports = Mongoose.model('EBCCValidationHeader_v_2_0', EBCCValidationHeaderSchema, 'TR_H_EBCC_VALIDATION');