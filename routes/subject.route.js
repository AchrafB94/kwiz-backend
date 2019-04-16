const express = require("express")
const subjects = express.Router()
const cors = require('cors')

const Subject = require("../model/subject.model")
subjects.use(cors())

subjects.get('/all', (req,res) => {
    Subject.findAll().then(subjects => res.json(subjects))
})

subjects.get('/get/:id', (req,res) => {
    Subject.findOne({
        where: {id: req.params.id}
    }).then(subject => res.json(subject))
})

module.exports = subjects