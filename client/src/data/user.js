const ax = require("axios");

const axios = ax.default.create({baseURL: "http://localhost:8000/api/user"})

function parseCookie(cookie){
    return cookie.split('=')[1];
}

const login = async function(email, password) {
    try {
        const reqData = {
            email: email,
            password: password
        }
        const user = await axios.post("/login", reqData);
        return user.data;
    }
    catch (err){
        console.log(err.response.data.error)
    }
}

const register = async function(username, email, password){
    try {
        const reqData = {
            username: username,
            email: email,
            password: password
        }

        const user = await axios.post("/register", reqData);

        return user.data;
        
    }
    catch (err){
        console.log(err.response.data.error)
    }
}

//get all user data for the profile page
const get_user_data = async function(jwt){
    try {
       const response =  await axios.get(`/getUser`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            },
            withCredentials: true,
        })

        const user = response.data;
        return user;
    }
    catch(err){
        console.log("Error calling for getting userData")
    }
}

//get username from backend for making a post (question, answer, comment)
const get_username = async function(jwt){
    try {
        const response =  await axios.get(`/getUsername`, {
             headers: {
                 'Authorization': `Bearer ${jwt}`
             },
             withCredentials: true,
         })
 
         const username = response.data;
         return username;
     }
     catch(err){
         console.log("Error calling for getting userData")
     }
}

const get_reputation = async function(cookie){
    let token = parseCookie(cookie);
    try{
        const res = await axios.get('/get_reputation', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        })
        return res.data.rep;
    }
    catch(err){
        console.log("error retrieving reputation from database")
    }
}

const getAllUsers = async function() {
    try {

        const users = await axios.get("/getAllUsers");
        return users.data;
    }
    catch (err){
        console.log(err.response.data.error)
    }
}



module.exports = {login, register, get_user_data, get_reputation, parseCookie, get_username, getAllUsers};