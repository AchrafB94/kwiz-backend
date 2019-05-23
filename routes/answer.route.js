const express = require("express")
const answers = express.Router()
const cors = require('cors')

const Answer = require("../model/answer.model")
questions.use(cors())

answers.post('/',(req,res) => {

    const answerData = {
        questionId: req.params.questionId,
        text: req.params.text,
        isCorrect: req.params.isCorrect
    }
    Answer.create(answerData).then(answer =>
        res.json({status: 'answer id :' +answer.id+'has been created'})
    )
})

answers.put('/:id',(req,res) => {


    Answer.update({
        text: req.params.text,
        isCorrect: req.params.isCorrect
    },{where: {id: req.params.id}}).then(answer =>
        res.json({status: 'answer id :' +answer.id+'has been updated'})
    )
})


answers.delete('/:id',(req,res) => {


    Answer.delete({where: {id: req.params.id}}).then(answer =>
        res.json({status: 'answer id :' +answer.id+'has been deleted'})
    )
})


module.exports = answers