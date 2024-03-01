var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sign = require("jsonwebtoken").sign;
var {compare, hash} = require("bcrypt");

var UserSchema = new Schema(
    {
        username: {type: String, required: true },
        password: {type: String, required: true },
        email: {type: String, required: true},
        verfied: {type: Boolean, default: false},
        admin: {type: Boolean, default: false},
        questions: [{type: Schema.Types.ObjectId, ref: 'Questions'}],
        answers: [{type: Schema.Types.ObjectId, ref: 'Answers'}],
        comments: [{type: Schema.Types.ObjectId, ref: 'Comments'}],
        Reputation: {type: Number, default: 50},
        time_user_created: {type: Date, default: new Date()}

    }
);

//middleware to encrypt our user's passwords
UserSchema.pre('save', async function(next) {
    if (this.isModified("password")){
        this.password = await hash(this.password, parseInt(process.env.SALTROUNDS));
    }
    return next();
});

UserSchema.methods.comparePasswords = async function(password){
    return await compare(password, this.password);
}

UserSchema.methods.gen_webtkn = async function(){
    const token = await sign({_id:this._id}, process.env.JWT_SECRET_KEY, { algorithm: 'HS256' });
    return token
}

UserSchema
.virtual('url')
.get(function () {
return '' + this._id;
});

module.exports = mongoose.model('User', UserSchema);