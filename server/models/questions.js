// Question Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema(
    {
        title: {type: String, required: true, maxLength: 100},
        text: {type: String, required: true},
        tags: [{type: Schema.Types.ObjectId, ref: 'Tags', required: true}], 
        answers: [{type: Schema.Types.ObjectId, ref: 'Answers'}], 
        asked_by: {type: String, default: 'Anonymous'},
        ask_date_time: {type: Date, default: new Date()},
        views: {type: Number, default: 0},
        upvotes: {type: Number, default: 0},
        downvotes: {type: Number, default: 0},
        comments: [{type: Schema.Types.ObjectId, ref: 'Comments'}],
        user: {type: Schema.Types.ObjectId, ref: 'User'},
    }
);

QuestionSchema
.virtual('url')
.get(function () {
return '/posts/question/' + this._id;
});

QuestionSchema
.virtual('TimeSincePost')
.get(function () {
    return Math.floor((Date().getTime - this.ask_date_time.getTime()) / 1000);
})


module.exports = mongoose.model('Questions', QuestionSchema);

