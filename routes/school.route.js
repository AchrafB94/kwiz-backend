const express = require("express")
const schools = express.Router()
const cors = require('cors')

const School = require("../model/school.model")
schools.use(cors())

schools.get('/count', (req,res) => {
    School.count().then(school => res.json(school))
})

schools.get('/:id', (req,res) => {
    School.findOne({
        where: {id: req.params.id}
    }).then(school => res.json(school))
})

schools.get('/', (req,res) => {
    School.findAll().then(school => res.json(school))
})

schools.post('/',(req,res) => {
    const schoolData = {
        name: req.body.name
    }
    School.create(schoolData)
    .then(school => {
        res.json({ status: 'school id: ' + school.id + ' added' })
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

schools.put('/:id/', function (req, res, next) {
    School.update({
      name: req.body.name},
      {where: {id: req.params.id}}
    )
    .then(function(rowsUpdated) {
      res.json(rowsUpdated)
    })
    .catch(next)
   })

schools.delete('/:id',(req,res) => {
    School.destroy({
        where: {
            id: req.params.id
        }
    }).then(school => {
        res.json({status: 'school id :' +school.id+'has been deleted'})
    }).catch(err => {
        res.send('error:'+err)
    })
})

module.exports = schools