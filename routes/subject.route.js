const express = require("express")
const subjects = express.Router()
const cors = require('cors')

const Subject = require("../model/subject.model")
subjects.use(cors())

subjects.get('/', (req,res) => {
    Subject.findAll().then(subjects => res.json(subjects))
})


module.exports = subjects