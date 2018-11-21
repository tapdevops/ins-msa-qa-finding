const mongoose = require( 'mongoose' );

const FindingSchema = mongoose.Schema( {
	FINDING_CODE: String,
	WERKS: String,
	AFD_CODE: String,
	BLOCK_CODE: String,
	FINDING_CATEGORY: String,
	FINDING_DESC: String,
	FINDING_PRIORITY: String,
	DUE_DATE: {
		type: Date,
		default: function() {
			return null;
		}
	},
	ASSIGN_TO: String,
	PROGRESS: String,
	LAT_FINDING: String,
	LONG_FINDING: String,
	REFFERENCE_INS_CODE: String,
	INSERT_USER: String,
	INSERT_TIME: {
		type: Date,
		default: function() {
			return null;
		}
	},
	UPDATE_USER: String,
	UPDATE_TIME: {
		type: Date,
		default: function() {
			return null;
		}
	},
	DELETE_USER: String,
	DELETE_TIME: {
		type: Date,
		default: function() {
			return null;
		}
	}
});

module.exports = mongoose.model( 'Finding', FindingSchema, 'TR_FINDING' );