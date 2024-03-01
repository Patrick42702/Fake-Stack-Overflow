// Answer Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnswerSchema = new Schema(
    {
        text: {type: String, required: true},
        ans_by: {type: String, required: true},
        ans_date_time: {type: Date, default: new Date()},
        upvotes: {type: Number, default: 0},
        downvotes: {type: Number, default: 0},
        comments: [{type: Schema.Types.ObjectId, ref: 'Comments'}],
        user: {type: Schema.Types.ObjectId, ref: 'User'}
    }
);

AnswerSchema
.virtual('url')
.get(function () {
return '/posts/answer/' + this._id;
});


module.exports = mongoose.model('Answers', AnswerSchema);
