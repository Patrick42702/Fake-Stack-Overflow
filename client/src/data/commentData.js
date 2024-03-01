const {parseCookie} = require("./user")
const ax = require("axios");
const axios = ax.default.create({baseURL: "http://localhost:8000/api/comments"})

const get_comments = async(post_type, post_id) => {
    try{

        const response = await axios.get(`/getComments/${post_type}/${post_id}`);
        const comments = response.data;
        return comments
    }
    catch(error){
        console.error("Error receiving function call from axios")
    }
}

const new_comment = async(commentData, token) => {
    try {
        let comment = {
            text: commentData.text,
            post_type: commentData.post_type,
            post_id: commentData.post_id
        }
        await axios.post(`/newComment`, comment, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true,
        })
    }
    catch(err){
        console.log("Error calling for posting commentData")
    }
}


module.exports = {new_comment, get_comments};