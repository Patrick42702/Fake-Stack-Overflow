const answerModel = require("../models/answers");
const quesModel = require("../models/questions");

const getAnswers = async (req, res, next) => {
    try {
        const currentQuestionId = req.params.currentQuestionId;
        const answers = await quesModel.findById(currentQuestionId)
        .populate({
            path: 'answers',
            populate: {
                path: 'comments',
                model: 'Comments'
            }
        }).select("answers");
        res.send(answers);
    }
    catch (error){
        next(error)
    }
}

const increaseViews = async (req, res, next) => {
    try {
        const currentQuestionId = req.params.currentQuestionId
        await quesModel.updateOne({_id: currentQuestionId}, {$inc: {views: 1}});
        res.send("success")
    }
    catch (error) {
        next(error)
    }
}

const postNewAnswer = async (req, res, next) => {
    try { // Goal: Create new Answer with schema, save to db, add answer to coressponding question
        // Params
        console.log(req.user)
        const currentQuestionId = req.params.currentQuestionId;
        const answerData = req.body;
        let text = answerData.text;
        let ans_by = answerData.name;

        let answer = new answerModel({
            text: text,
            ans_by: ans_by,
            ans_date_time: new Date(),
            user: req.user._id
        });

        answer.save();

        // this should add the answer to the corresponding question but idk if it works
        await quesModel.updateOne(
            { _id: currentQuestionId },
            { $push: { answers: answer }});
        
        res.send("success")
    }
    catch (error){
        next(error)
    }
}

module.exports = {
    getAnswers,
    increaseViews,
    postNewAnswer
}