/*
 |--------------------------------------------------------------------------
 | Models - Rating Log
 |--------------------------------------------------------------------------
 */
const mongoose = require('mongoose');
const FindingCommentTagSchema = mongoose.Schema({
	USER_AUTH_CODE: String,
	FINDING_COMMENT_ID: String
});

/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
module.exports = mongoose.model('CommentTag_v_2_0', FindingCommentTagSchema, 'TR_FINDING_COMMENT_TAG');