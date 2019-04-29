const express = require("express")
const questions = express.Router()
const cors = require('cors')

const Question = require("../model/question.model")
const Answer = require("../model/answer.model")
questions.use(cors())

questions.get('/count', (req,res) => {
    Question.count('id').then(question => res.json(question))
})

questions.get('/suggest/:subjectId/:levelId',(req,res) => {
    Question.findOne({
        where: {subjectId: req.params.subjectId, levelId: req.params.levelId},
        include: {model: Answer}
    })
})


questions.put('/:id')
questions.put('/delete/:id')

questions.post('/')

module.exports = questions