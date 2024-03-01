//this file will contain the functions needed to interact with database
//for registering user, logging in user, etc.
QuestionModel = require('../models/questions');
const user_mdl = require("../models/user");


//we will receive the data as a json object
const registerUser = async (req, res, next) => {
    try{
        const {username, email, password} = req.body;

        let user = await user_mdl.find({email: email});

        //if this user already exists, throw an error
        if (user.length == 1){
            res.status(500).json({error: "User already exists, choose a different email"});
        }

        let newUser = await user_mdl.create({
            username: username,
            password: password,
            email: email
        });

        res.json({
            _id: newUser._id,
            username: newUser.username,
            admin: newUser.admin,
            email: newUser.email
        });
    }
    catch (err){
        next(err);
    }
}

const loginUser = async (req, res, next) => {

    const { email, password } = req.body;


    let user = await user_mdl.findOne({email: email});


    if (!user) {
        return res.status(500).json({error: "Invalid email or password"});
    }

    try {
        if( await user.comparePasswords(password)){
            const gen_webtkn = await user.gen_webtkn()
        return res.status(201).json(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                admin: user.admin,
                verfied: user.verfied,
                token: gen_webtkn
            });
        }
        else{
            return res.status(500).json({error: "Invalid email or password"});
        }
    }
    catch(err) {
        next(err);
    }
}

//will take a jwt from the front end, erify it, and return userdata it needs
const getUser = async (req, res, next) =>{
    try{
        const user = req.user;
        const email = user.email;
        const result = await user_mdl.find({email: email}).populate("questions")
        res.send(result[0]);
        console.log("made it")
    }
    catch(err){
        next(err)
    }
}

const getAllUsers = async (req, res, next) =>{
    try{
    
        const result = await user_mdl.find({})
        // console.log(result)
        res.send(result);     
    }
    catch(err){
        next(err)
    }
}

//will take a jwt from the front end, verify it, and return username
const getUsername = async (req, res, next) => {
    try{
        const username = req.user.username;
        res.send(username);
        console.log("made it get username")
    }
    catch(err){
        next(err)
    }
    
}

const getReputation = async (req, res, next) => {
    res.status(200).json({rep: req.user.Reputation})
}

module.exports = {
    registerUser,
    loginUser,
    getReputation,
    getUser, 
    getUsername,
    getAllUsers
}