const express = require("express")
const levels = express.Router()
const cors = require('cors')

const Level = require("../model/level.model")
levels.use(cors())


levels.get('/', (req,res) => {
    Level.findAll().then(level => res.json(level))
})

levels.post('/',(req,res) => {
    const levelData = {
        name: req.body.name
    }
    Level.create(levelData)
    .then(level => {
        res.json(level)
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

levels.put('/:id/', function (req, res, next) {
    Level.update({
      name: req.body.name},
      {where: {id: req.params.id}}
    )
    .then(level => res.json(level))
    .catch(next)
   })

levels.delete('/:id',(req,res) => {
    Level.destroy({
        where: {
            id: req.params.id
        }
    }).then(level => {
        res.json({status: 'level id :' +level.id+'has been deleted'})
    }).catch(err => {
        res.send('error:'+err)
    })
})

module.exports = levels