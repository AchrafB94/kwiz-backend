const express = require("express")
const scores = express.Router()
const cors = require('cors')

const Score = require("../model/score.model")
scores.use(cors())

scores.post('/add', (req, res) => {
    const today = new Date()
    const scoreData = {
        quizId: req.body.quizId,
        userId: req.body.userId,
        schoolId: req.body.schoolId,
        levelId: req.body.levelId,
        subjectId: req.body.subjectId,
        score: req.body.score,
        time: req.body.time,
        percentage: req.body.percentage,
        medal: req.body.medal,
        created: today
    }
    Score.create(scoreData)
    .then(score => {
        res.json({ status: score.id + ' added' })
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})


module.exports = scores