const express = require("express");

const {authenticate} = require("../middleware/auth");

const {
    getAnswers,
    increaseViews,
    postNewAnswer
} = require("../controllers/ansController");

const router = express.Router();

router.get("/quesAnswers/:currentQuestionId", getAnswers);
router.post("/increaseViews/:currentQuestionId", increaseViews);
router.post("/newAnswer/:currentQuestionId", authenticate, postNewAnswer);

module.exports = router;