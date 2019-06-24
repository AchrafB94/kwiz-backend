const express = require("express")
const questions = express.Router()
const cors = require('cors')
const Sequelize = require("sequelize");
const Op = Sequelize.Op

const Question = require("../model/question.model")
const Answer = require("../model/answer.model")
questions.use(cors())

questions.get('/count', (req,res) => {
    Question.count('id').then(question => res.json(question))
})

questions.get('/import/',(req,res) => {
    Question.findOne({
        where: {subjectId: req.body.subjectId, levelId: req.body.levelId, quizId: {[Op.nt]: req.body.quizId}},
        include: {model: Answer}
    }).then(question => res.json(question))
})

questions.get('/quiz/:id', (req,res) => {
    Question.findAll({where: {quizId: req.params.id},include: {model: Answer}}).then(question => res.json(question))
})

questions.get('/:id', (req,res) => {
    Question.findByPk(req.params.id,{include: {model: Answer}}).then(question => res.json(question))
})


questions.delete('/:id', (req,res) => {
    Question.destroy({where: {id: req.params.id}}).then(question =>  res.json({status: 'question has been removed from the quiz'}))
})

questions.delete('/answer/:questionId/:id',(req,res) => {

    console.log(req.params.questionId)

    Answer.destroy({where: {id: req.params.id}}).then(result =>

            Answer.count({where: {isCorrect: true,questionId: req.params.questionId}})).then(count => {
             count > 1 ? Question.update({type: 'multiple',minimum: count},{where: {id: req.params.questionId}}) : 
             Question.update({type: 'single',minimum: count},{where: {id: req.params.questionId}})})
        .then(res.json({status: 'answer has been deleted'})
    )
})

questions.post('/answer/',(req,res) => {
    const AnswerData = {
        questionId: req.body.questionId,
        text: req.body.text,
        isCorrect: req.body.isCorrect
    }

    Answer.create(AnswerData).then(result =>

            Answer.count({where: {isCorrect: true,questionId: req.body.questionId}})).then(count => {
             count > 1 ? Question.update({type: 'multiple',minimum: count},{where: {id: req.body.questionId}}) : 
             Question.update({type: 'single',minimum: count},{where: {id: req.body.questionId}})})
        .then(res.json({status: 'answer has been created'})
    )
})

questions.post('/',(req,res) => {
    const questionData = {
        quizId: req.body.quizId,
        text: req.body.text,
        subjectId: req.body.subjectId,
        levelId: req.body.levelId,
        answers: req.body.answers
    }
    Question.create(questionData).then(result => {
        answers = questionData.answers
  
          answers.forEach(answer => {
  
            var isCorrect = true
            if(answer.value === 'true') {isCorrect = true}
            else(isCorrect = false)
            answerData = {
              questionId: result.id,
              text: answer.text,
              isCorrect: isCorrect
            }
            Answer.create(answerData)
        })
        
    }).then(result => {
        res.json({status: 'question has been created: '+result})
    })
    
})
questions.put('/answer/:id',(req,res) => {
    Answer.update({text: req.body.text,
        isCorrect: req.body.isCorrect},{where: {id: req.params.id}}).then(result =>

            Answer.count({where: {isCorrect: true,questionId: req.body.questionId}})).then(count => {
             count > 1 ? Question.update({type: 'multiple',minimum: count},{where: {id: req.body.questionId}}) : 
             Question.update({type: 'single',minimum: count},{where: {id: req.body.questionId}})})
        .then(res.json({status: 'answer has been updated'})
    )
})
questions.put('/:id',(req,res) => {
    Question.update({
        text: req.body.text,
    },{where: {id: req.params.id}}).then(question =>
        res.json({status: 'question id :' +question.id+' has been updated'})
    )
})



module.exports = questions