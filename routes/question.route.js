const express = require("express")
const questions = express.Router()
const cors = require('cors')

const Question = require("../model/question.model")
const Answer = require("../model/answer.model")
questions.use(cors())

questions.get('/count', (req,res) => {
    Question.count('id').then(question => res.json(question))
})

questions.get('/import/:subjectId/:levelId',(req,res) => {
    Question.findOne({
        where: {subjectId: req.params.subjectId, levelId: req.params.levelId},
        include: {model: Answer}
    })
})



questions.put('/delete/:id', (req,res) => {
    Question.update({where: {id: req.params.id}},
        {quizId: null}).then(question =>  res.json({status: 'question id :' +question.id+'has been removed from the quiz'}))
})

questions.post('/create',(req,res) => {


    const questionData = {
        quizId: req.body.quizId,
        text: req.body.text,
        subjectId: req.body.subjectId,
        levelId: req.body.levelId
    }
    Question.create(questionData).then(question =>
        res.json({status: 'question id :' +question.id+'has been created'})
    )
})



questions.post('/',(req,res) => {

    const questionData = {
        quizId: req.body.quizId,
        text: req.body.text,
        subjectId: req.body.subjectId,
        levelId: req.body.levelId
    }
    Question.create(questionData).then(question =>
        res.json({status: 'question id :' +question.id+'has been created'})
    )
})

questions.put('/:id',(req,res) => {


    Question.update({
        text: req.params.text,
        type: req.params.type,
        minimum: req.params.minimum,
        subjectId: req.params.subjectId,
        levelId: req.params.levelId
    },{where: {id: req.params.id}}).then(question =>
        res.json({status: 'question id :' +question.id+'has been updated'})
    )
})


module.exports = questions