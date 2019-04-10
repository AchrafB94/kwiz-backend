const express = require("express")
const questions = express.Router()
const cors = require('cors')

const Question = require("../model/question.model")
questions.use(cors())

questions.get('/count', (req,res) => {
    Question.count('id').then(question => res.json(question))
})


module.exports = questions