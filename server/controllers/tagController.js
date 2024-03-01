const tagModel = require('../models/tags');
const quesModel = require('../models/questions');

const getAllTags = async (req, res, next) => {
    try {
        const allTags = await tagModel.find({});
        res.send(allTags);
    }
    catch(error){
        next(allTags);
    }
}

const getTags = async (req, res, next) => {
    try {
        let currentQuestionsId = req.params.currentQuestionsId
        const tagIds = await QuestionModel.findById(currentQuestionsId, 'tags' );
        res.send(tagIds);
    }
    catch(error){
        next(error);
    }
}

const getNumOfQuestions = async(req, res, next) => {
    try {
        let tagId = req.params.tagId
        const numOfQuestions = await quesModel.find({tags: tagId});
        res.send(numOfQuestions.length.toString());
    }
    catch(error) {
        next(error)
    }
}

module.exports = {
    getTags,
    getAllTags,
    getNumOfQuestions
}