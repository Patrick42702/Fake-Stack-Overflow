const express = require("express");

const {
    postNewComment,
    getComments
} = require("../controllers/commentController")
const {authenticate} = require("../middleware/auth")

const router = express.Router()

router.get("/getComments/:post_type/:post_id", getComments);
router.post("/newComment", authenticate, postNewComment);

module.exports = router;