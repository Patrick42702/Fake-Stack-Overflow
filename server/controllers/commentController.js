const com_mdl = require("../models/comments");
const ans_mdl = require("../models/answers");
const ques_mdl = require("../models/questions");

const getComments = async(req, res, next) => {
    try{
        const post_id = req.params.post_id;
        const post_type = req.params.post_type;
        var comments;
        if (post_type === "question"){
            com_query = await ques_mdl.findById(post_id).populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
            comments = com_query.comments
        }else if (post_type === "answer"){
            let com_query = await ans_mdl.findById(post_id).populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
            comments = com_query.comments
        }
        else{
            res.status(500).json({error: "Unknown post_type requested"});
        }
        res.send(comments);
    }
    catch(err){
        next(err)
    }
}

const postNewComment = async(req, res, next) => {
    try {  
        const {post_type, post_id, text} = req.body;
        const user = req.user;
        const new_comment = {
            user: user._id,
            text: text
        }
        let new_com = await com_mdl.create(new_comment);
        if (post_type === "question"){
            const ques = await ques_mdl.findById(post_id);
            ques.comments.push(new_com._id);
            await ques.save()
        }
        else if(post_type === "answer"){
            const ans = await ans_mdl.findById(post_id);
            ans.comments.push(new_com._id);
            await ans.save()
        }
        else{
            res.status(500).json({error: "Post_type is neither question or answer"});
        }
        res.send("success")
    }
    catch (err) {
        console.log("error pushing to database")
        next(err)
    }
}

module.exports = {postNewComment, getComments}