//These functions get necessary data from the database
var mongoose = require('mongoose');
QuestionModel = require('../models/questions');
AnswerModel = require('../models/answers'); 
TagModel = require('../models/tags'); 
UserModel = require('../models/user')
CommentModel = require('../models/comments')


const getNewest = async (req, res, next) => {
    try {
        const questions = await QuestionModel.find().populate("tags")
        .sort({ ask_date_time: -1 });
        res.send(questions);
    }
    catch(error) {
        next(error)
    }
}

const getUnanswered = async (req, res, next) => {
    try {
        const questions = await QuestionModel.find({answers: {$size: 0}}).populate("tags");
        res.send(questions);
    }
    catch(error) {
        next(error);
    }
}
    const getActive = async (req, res, next) => {
    try {
        const questions =  await QuestionModel.find().populate("tags"); 
        const answersByNewest = await AnswerModel.find().sort({ans_date_time: -1});
        let quesSet = new Set();
        answersByNewest.forEach(answer => {

            let id = "" + answer.id;
            
            questions.forEach(question => {

                for(let i = 0; i < question.answers.length; i++){
                    let q = "" + question.answers[i];
                    if(id == q){
                        quesSet.add(question);
                    }
                }

            })
        });

        let active = Array.from(quesSet);

        questions.forEach(question => {
            if(question.answers.length == 0){
                active.push(question);
            }
        });
        res.send(active);
    }
    catch(error) {
        next(error)
    }
}

const getSearch = async (req, res, next) => {
    try {
        let searchString = req.params.searchString;
        let lowercase_string = searchString.toLowerCase();

        const bracket_words = lowercase_string.match(/\[[^\]]*\]/g);
        let word_in_brackets;

        if (bracket_words) {
          word_in_brackets = bracket_words.map((match) => match.slice(1, -1));
        }


        const normal_words = lowercase_string
        .split(" ")
        .filter((char) => char !== "")
        .filter(string => string.charAt(0) !== "[" && string.charAt(string.length - 1) !== "]");

        const questions =  await QuestionModel.find().populate('tags'); 
        let searchQs = new Set();

        questions.forEach(question => {
            let questionTags = question.tags;
            let tagArr = []

            questionTags.forEach(tag => {
                tagArr.push(tag.name)
            })

            if (word_in_brackets) {
                for (let word of word_in_brackets) {
                  if (tagArr.includes(word)) {
                    searchQs.add(question);
                  }
                }
              }

            for (let word of normal_words) {
                if (
                  question.title.toLowerCase().includes(word) ||
                  question.text.toLowerCase().includes(word)
                ) {
                  searchQs.add(question);
                }
              }



        })

        let search = Array.from(searchQs);

        res.send(search);
    }
    catch(error) {
        next(error);
    }
}

// pass in a struct of the question data as parameter 
const postNewQuestion = async (req, res, next) => {
    console.log("ran")
    try {
        let questionData = req.body;
        let title = questionData.title;
        let text = questionData.text;
        let tagString = questionData.tags;
        let asked_by = questionData.name;

        const email = questionData.email;
        // console.log(email)

        const tagNames = tagString.split(" ");


        const newTagsToAdd = new Set();
        const tags = [];

        const allTags = await TagModel.find({});

        // Check tags in Database with tags input by user to see if they exist in the db already
        // if they do add that tag to an array that will be added to the new question param 
        // if not add to an array that will create a new tag

        let tagBool = false;
        for(let i = 0; i < tagNames.length; i++){
            tagBool = false;
            for(let j = 0; j < allTags.length; j++){
                if (tagNames[i] == allTags[j].name){
                        tags.push(allTags[j]);
                        tagBool = true;
                        break;
                } else{
                        
                }
                
            }
            if(tagBool == false){
                newTagsToAdd.add(tagNames[i])
            }
        }
        

        // for each tag add tag into tag schema then push into an array
        newTagsToAdd.forEach(name => {
            let newTag = new TagModel({
                name: name
            })
            newTag.save();
            tags.push(newTag);
        })

        // console.log("Tags " + tags);

        // Create new Question with Schema
        let newQuestion = new QuestionModel({
            title: title,
            text: text,
            tags: tags,
            asked_by: asked_by,
            ask_date_time: new Date(),
            user: req.user._id
        });

        // Save newly created Question to the database
        newQuestion.save();
        // console.log(newQuestion.asked_by)
        // Add Question to user who made question
        // console.log(newQuestion.id)
        await UserModel.updateOne({email: email}, {$push: { questions: newQuestion.id }})
        // console.log(result);


        res.send("success");
    }
    catch(error) {
        next(error);
    }
}


const populateQuestion = async (req, res, next) => {
    try {
        console.log("error")
        let questionData = req.body;
        const id = questionData.id

        const question = await QuestionModel.findById(id).populate("tags")
        console.log(question)
        res.send(question)
        // .sort({ ask_date_time: -1 });
        // res.send(questions);
    }
    catch(error) {
        next(error)
    }
}

const updateQuestion = async (req, res, next) => {
    try {
        let questionData = req.body;
        console.log(questionData);
        const title = questionData.title
        const text = questionData.text;
        // const tags = questionData.tags;
        let tagString = questionData.tags;
        const id = questionData.id

        const tagNames = tagString.split(" ");


        const newTagsToAdd = new Set();
        const tags = [];

        const allTags = await TagModel.find({});

        // Check tags in Database with tags input by user to see if they exist in the db already
        // if they do add that tag to an array that will be added to the new question param 
        // if not add to an array that will create a new tag

        let tagBool = false;
        for(let i = 0; i < tagNames.length; i++){
            tagBool = false;
            for(let j = 0; j < allTags.length; j++){
                if (tagNames[i] == allTags[j].name){
                        tags.push(allTags[j]);
                        tagBool = true;
                        break;
                } else{
                        
                }
                
            }
            if(tagBool == false){
                newTagsToAdd.add(tagNames[i])
            }
        }
        

        // for each tag add tag into tag schema then push into an array
        newTagsToAdd.forEach(name => {
            let newTag = new TagModel({
                name: name
            })
            newTag.save();
            tags.push(newTag);
        })

        await QuestionModel.updateOne({ _id: id }, { $set: { title: title } })
        await QuestionModel.updateOne({ _id: id }, { $set: { text: text } })
        await QuestionModel.updateOne({ _id: id }, { $set: { tags: tags } })

        // const t = await TagModel.find({})
        // console.log(t)


        // console.log(QuestionModel.findById(id))

        res.send("success");

        // console.log(id)

        // const question = await QuestionModel.findById(id).populate("tags")
        // console.log(question)
        // res.send(question)
        // .sort({ ask_date_time: -1 });
        // res.send(questions);
    }
    catch(error) {
        next(error)
    }
}

const deleteQuestion = async (req, res, next) => {
    try {
        let questionData = req.body;
        // console.log(questionData);
        const email = questionData.email;
        const id = questionData.id;

        const question = await QuestionModel.findById(id).populate("answers").populate('comments')
        const answers = question.answers;

        const objectId = new mongoose.Types.ObjectId(id);

        await UserModel.updateOne({ email: email },{ $pull: { questions: objectId } })
        
        
        // console.log(answers)


        await answers.forEach((answer) => {
            let id = answer._id;
            AnswerModel.deleteOne({ _id: id })
        })
        const comments = question.comments;

       await comments.forEach((comment) => {
            let id = comment._id;
            CommentModel.deleteOne({ _id: id })
        })
        // console.log(comments)
        // console.log(question);

        await QuestionModel.deleteOne({ _id: id })

        res.send("success")
    
    }
    catch(error) {
        next(error)
    }
}

// get search



module.exports = {
    getNewest,
    getUnanswered,
    getActive,
    getSearch,
    postNewQuestion,
    populateQuestion,
    updateQuestion,
    deleteQuestion
};