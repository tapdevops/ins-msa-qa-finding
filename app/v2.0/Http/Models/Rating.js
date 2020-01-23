/*
 |--------------------------------------------------------------------------
 | Models - Rating
 |--------------------------------------------------------------------------
 */
const mongoose = require('mongoose');
const RatingSchema = mongoose.Schema({
	FINDING_CODE: String,
	RATE: Number,
	MESSAGE: {
		type: String,
		default: function () {
			return "";
		}
	}
});

/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
module.exports = mongoose.model('Rating_v_2_0', RatingSchema, 'TR_RATING');
