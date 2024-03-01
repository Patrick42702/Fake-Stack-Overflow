const ans_mdl = require("../models/answers")
const ques_mdl = require("../models/questions")
const com_mdl = require("../models/comments")
const user_mdl = require("../models/user");

async function upvote(req, res, next){
    try{
        const {post_type, post_id, user} = req.body;
        
        if (req.user._id.toString() === user){
            res.send("same user");
            return;
        }

        if (req.user.Reputation < 50){
            res.send("Not enough reputation to vote!")
            return;
        }

        await user_mdl.updateOne({_id: user}, {$inc: {Reputation: 5}})

        switch (post_type){
            case "answer":
                await ans_mdl.updateOne({_id: post_id}, {$inc: {upvotes: 1}})
                break;
            case "question":
                await ques_mdl.updateOne({_id: post_id}, {$inc: {upvotes: 1}})
                break;
            case "comment":
                await com_mdl.updateOne({_id: post_id}, {$inc: {upvotes: 1}})
                break;
            default:
                console.log("Post type is incorrect!")
                break;
        }
        console.log("upvote increased successfully")
        res.send("success");
    }
    catch(err){
        next(err)
    }
}

async function downvote(req, res, next){
    try{
        const {post_type, post_id, user} = req.body;
        if (req.user._id.toString() === user){
            res.send("same user");
            return;
        }

        if (req.user.Reputation < 50){
            res.send("Not enough reputation to vote!")
            return;
        }

        await user_mdl.updateOne({username: user}, {$inc: {Reputation: -10}})
        switch (post_type){
            case "answer":
                await ans_mdl.updateOne({_id: post_id}, {$inc: {downvotes: 1}})
                break;
            case "question":
                await ques_mdl.updateOne({_id: post_id}, {$inc: {downvotes: 1}})
                break;
            default:
                console.log("Post type is incorrect!")
                break;
        }
        res.send("success");
    }
    catch(err){
        next(err)
    }
}

module.exports = {upvote, downvote}