//this is our modular file used to connect to db

const mongoose = require("mongoose");

const connect_DB = async() => {
    try {
        await mongoose.connect(process.env.DB_HOST);
        console.log("Connected to mongoDB");
        return mongoose.connection;
    }
    catch (error) {
        console.log(`Error in connecting to db : ${error}`)
        process.exit(1);
    }
}

module.exports = {connect_DB};