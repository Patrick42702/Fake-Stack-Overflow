//this file will contain our authentication middleware
const verify = require("jsonwebtoken").verify;
const User = require("../models/user");

const authenticate = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            const webtkn = req.headers.authorization.split(" ")[1];

            const {_id} = verify(webtkn, process.env.JWT_SECRET_KEY);

            req.user = await User.findById(_id);

            next(null);
        }
        catch (error) {
            let err = new Error("not authorized, incorrect token provided");
            err.statusCode = 401;
            next(err)
        }
    }
    else {
        let err = new Error("No token, user is not authorized");
        err.statusCode = 401;
        next(err);
    }
}

module.exports = { authenticate };