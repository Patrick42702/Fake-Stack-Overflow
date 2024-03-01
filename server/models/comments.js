var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema(
    {
        text: {type: String, required: true},
        upvotes: {type: Number, default: 0},
        user: {type: Schema.Types.ObjectId, ref: 'User'},
    }
);

module.exports = mongoose.model('Comments', CommentSchema);