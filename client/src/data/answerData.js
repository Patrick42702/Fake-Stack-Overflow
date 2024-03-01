const {parseCookie} = require("./user")
const ax = require("axios");

const axios = ax.default.create({baseURL: "http://localhost:8000/api/answers"})

const getAnswers = async(currentQuestionId) => {
    try {
        const answers = await axios.get(`/quesAnswers/${currentQuestionId}`);
        return answers.data.answers;
    }
    catch (error){
        console.log("error getting answers from server " + error)
    }
}

const increaseViews = async(currentQuestionId) => {
    try {
        await axios.post(`/increaseViews/${currentQuestionId}`);
    }
    catch (error){
        console.log("error increasing views to server " + error)
    }
}

const postAnswer = async(currentQuestionId, answerData, token) => {
    console.log("posting answer")
    try {
        const postData = {
            name: answerData.name,
            text: answerData.text,
          }
        await axios.post(`/newAnswer/${currentQuestionId}`, postData, {
            headers: {
                'Authorization': `Bearer ${parseCookie(token)}`
            },
            withCredentials: true,
        });
    }
    catch (error){
        console.log("error posting the new answer to the backend " + error)
    }
}


module.exports = {
    getAnswers,
    increaseViews,
    postAnswer
}