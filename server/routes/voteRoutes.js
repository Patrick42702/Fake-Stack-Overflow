const express = require("express");

const { authenticate } = require("../middleware/auth");

const {upvote, downvote} = require("../controllers/voteController")

const router = express.Router();

router.post("/upvote", authenticate, upvote);
router.post("/downvote", authenticate, downvote)

module.exports = router;