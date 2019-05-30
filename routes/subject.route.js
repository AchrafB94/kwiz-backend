const express = require("express")
const subjects = express.Router()
const cors = require('cors')

const Subject = require("../model/subject.model")
subjects.use(cors())

subjects.get('/count', (req,res) => {
    Subject.count().then(subjects => res.json(subjects))
})

subjects.get('/:id', (req,res) => {
    Subject.findOne({
        where: {id: req.params.id}
    }).then(subject => res.json(subject))
})

subjects.get('/', (req,res) => {
    Subject.findAll().then(subjects => res.json(subjects))
})


subjects.post('/',(req,res) => {
    const subjectData = {
        name: req.body.name
    }

    Subject.create(subjectData).then(subject => res.json(subject))
})

subjects.put('/:id/', function (req, res, next) {
    Subject.update({
      name: req.body.name},
      {where: {id: req.params.id}}
    )
    .then(subject => res.json(subject))
})

subjects.delete('/:id',(req,res) => {
    Subject.destroy({
        where: {
            id: req.params.id
        }
    }).then(subject => {
        res.json({status: 'subject id :' +subject.id+'has been deleted'})
    }).catch(err => {
        res.send('error:'+err)
    })
})


module.exports = subjects