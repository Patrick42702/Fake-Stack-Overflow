//contains the routes to the controller functions for user
const express = require("express");
const { 
        registerUser, 
        loginUser,
        getReputation,
        getUser,
        getUsername,
        getAllUsers,
        } = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get_reputation", authenticate, getReputation);
router.get("/getUser", authenticate, getUser);
router.get("/getUsername", authenticate, getUsername);
router.get("/getAllUsers", getAllUsers);


module.exports = router;