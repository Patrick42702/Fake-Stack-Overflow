const ax = require("axios");
const axios = ax.default.create({baseURL: "http://localhost:8000/api/vote"})

const upvote = async(post_info, token) => {
    console.log(post_info)
    try {
        const res = await axios.post(`/upvote`, post_info, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true,
        })
        return res.data
    }
    catch (err){
        console.log("error contacting the back end to increase upvotes")
    }
}

const downvote = async(post_info, token) => {
    try {
        const res = await axios.post(`/downvote`, post_info, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true,
        })

        return res.data
    }
    catch (err){
        console.log("error contacting the back end to increase downvotes")
    }
}

module.exports = {upvote, downvote}