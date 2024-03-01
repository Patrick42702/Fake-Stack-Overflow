//this file will contain the functions that make requests to the 
//express server for use in our components.
const { parseCookie } = require("./user")
const ax = require("axios");

const axios = ax.default.create({ baseURL: "http://localhost:8000/api/questions" })

//const baseURL = "http://localhost:8000/api/questions"

const getQuestions = async (contentState, searchString) => {
    try {
        if (contentState === "Newest") {
            const data = await getQuestionsNewest();
            return data;
        }
        else if (contentState === "Unanswered") {
            const data = await getQuestionsUnanswered();
            return data;
        } else if (contentState === "Active") {
            const data = await getQuestionsActive();
            return data;
        } else if (contentState === "Search") {
            const data = await getQuestionsSearch(searchString);
            return data;
        }

    }
    catch (error) {
        console.error("Error receiving function call from axios")
    }

}

const getQuestionsNewest = async () => {
    try {
        const response = await axios.get(`/newest`, {
        });
        return response.data;
    }
    catch (error) {
        console.error("Error in request", error);
    }
}

const getQuestionsUnanswered = async () => {
    try {
        const response = await axios.get(`/unanswered`, {
        });
        return response.data;

    }
    catch (error) {
        console.error("Error in request");
    }
}

// get active

const getQuestionsActive = async () => {
    try {
        const response = await axios.get(`/active`, {
        });
        return response.data;

    }
    catch (error) {
        console.error("Error in request");
    }
}
// get search

const getQuestionsSearch = async (searchString) => {
    try {
        if (!searchString) {
            return [];
        }
        const response = await axios.get(`/search/${searchString}`);
        return response.data;

    }
    catch (error) {
        console.error("Error in request");
    }
}

const postQuestion = async (questionData, email, token) => {
    try {
        const postData = {
            title: questionData.title,
            text: questionData.text,
            tags: questionData.tags,
            name: questionData.username,
            email: email
        }
        console.log(postData)
        await axios.post(`/newQuestion`, postData, {
            headers: {
                'Authorization': `Bearer ${parseCookie(token)}`
            },
            withCredentials: true,
        });

    }
    catch (error) {
        console.error("Error in request");
    }
}

const populateQuestion = async(questionData, token) => {
    try {
        const postData = {
            id: questionData.id
          }
          console.log(postData)
        const response =  await axios.post(`/populateQuestion`, postData, {
            headers: {
                'Authorization': `Bearer ${parseCookie(token)}`
            },
            withCredentials: true,
        });
        return response.data;

    }
    catch (error){
        console.error("Error in request");
    }
}

const updateQuestion = async(questionData, token) => {
    try {
        const postData = {
            title: questionData.title,
            text: questionData.text,
            tags: questionData.tags,
            name: questionData.username,
            id: questionData.id
          }
         await axios.post(`/updateQuestion`, postData,{
            headers: {
                'Authorization': `Bearer ${parseCookie(token)}`
            },
            withCredentials: true,
        });

    }
    catch (error){
        console.error("Error in request");
    }
}

const deleteQuestion = async(questionData, token) => {
    try {
        const postData = {
            email: questionData.email,
            id: questionData.id
          }
         await axios.post(`/deleteQuestion`, postData, {
            headers: {
                'Authorization': `Bearer ${parseCookie(token)}`
            },
            withCredentials: true,
        });

    }
    catch (error){
        console.error("Error in request");
    }
}

module.exports = {
    getQuestions,
    postQuestion,
    populateQuestion,
    updateQuestion,
    deleteQuestion
}