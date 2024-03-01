const {parseCookie} = require("./user")
const ax = require("axios");

const axios = ax.default.create({baseURL: "http://localhost:8000/api/tags"})

const getTags = async() => {
    try {
        const tags = await axios.get(`/allTags`);
        return tags.data;
    }
    catch(error){
        console.error("error receiving tags from the backend");
    }
}

const getNumOfQuestions = async(tagId) => {
    try{
        const numOfQuestions = await axios.get(`/numOfQuestions/${tagId}`);
        return Number(numOfQuestions.data);
    }
    catch (error){
        console.error("Error receiving num of questions from backend");
    }
}

module.exports = {
    getTags,
    getNumOfQuestions
}