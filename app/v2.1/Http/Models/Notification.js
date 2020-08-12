/*
 |--------------------------------------------------------------------------
 | Models - Notif
 |--------------------------------------------------------------------------
 */
const mongoose = require('mongoose');
const NotificationSchema = mongoose.Schema({
	NOTIFICATION_ID: String,
	FINDING_CODE: String,
	NOTIFICATION_TO: String,
	CATEGORY: String,
    MESSAGE: String,
	INSERT_TIME: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return 0;
		}
	},
});

/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
module.exports = mongoose.model('Notification_v_2_1', NotificationSchema, 'TR_NOTIFICATION');
