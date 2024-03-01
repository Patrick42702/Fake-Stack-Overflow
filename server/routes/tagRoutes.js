const express = require("express");

const {
    getTags,
    getAllTags,
    getNumOfQuestions
} = require('../controllers/tagController');

const   router = express.Router();

router.get("/allTags", getAllTags);
router.get("/getTags/:currentQuestionsId", getTags);
router.get("/numOfQuestions/:tagId", getNumOfQuestions);

module.exports = router;