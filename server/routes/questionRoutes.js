const express = require("express");

const {
    getNewest,
    getUnanswered,
    getActive,
    getSearch,
    postNewQuestion,
    populateQuestion,
    updateQuestion,
    deleteQuestion,
    getTags
} = require('../controllers/quesController');
const {authenticate} = require("../middleware/auth")

const router = express.Router();

router.get('/newest', getNewest);
router.get('/unanswered', getUnanswered);
router.get('/active', getActive);
router.get('/search/:searchString', getSearch)
router.post('/newQuestion', authenticate, postNewQuestion)
router.post('/populateQuestion', authenticate, populateQuestion)
router.post('/updateQuestion', authenticate, updateQuestion)
router.post('/deleteQuestion', authenticate, deleteQuestion)


module.exports = router;