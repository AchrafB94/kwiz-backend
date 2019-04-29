const express = require("express");
const quiz = express.Router();
const cors = require("cors");

const Sequelize = require("sequelize");
const Op = Sequelize.Op
const Subject = require("../model/subject.model");
const Level = require("../model/level.model");
const Quiz = require("../model/quiz.model");
const Question = require("../model/question.model");
const Answer = require("../model/answer.model");
const User = require('../model/user.model')

Level.hasMany(Quiz);
Quiz.belongsTo(Level);

Subject.hasMany(Quiz);
Quiz.belongsTo(Subject);

User.hasMany(Quiz);
Quiz.belongsTo(User);

Quiz.hasMany(Question);
Question.belongsTo(Quiz);

Question.hasMany(Answer);
Answer.belongsTo(Question);


quiz.use(cors());


quiz.get("user/:userId")

quiz.put("organize/:quizId")





quiz.get("/available/:levelId", (req, res) => {
  Quiz.findAll({
    where: {rank: 1,levelId: req.params.levelId},
    order: Sequelize.fn("RAND"),
    include: [{ model: Subject }, { model: Level }, {model: User, attributes: ['firstname', 'lastname']}]
  }).then(quiz => res.json(quiz));
});



quiz.get("/suggest/:subjectId/:currentId", (req, res) => {
  Quiz.findAll({
    where: {subjectId: req.params.subjectId, id: {[Op.ne]: req.params.currentId}},
    order: Sequelize.fn("RAND"),
    limit: 3,
    include: [{ model: Subject }, { model: Level }, {model: User, attributes: ['firstname', 'lastname']}]
  }).then(quiz => res.json(quiz));
});

quiz.put("/updatePlayed/:id", (req, res) => {
  Quiz.update({ played: Sequelize.literal('played + 1') }, { where: { id: req.params.id } })
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

quiz.put("/updateMedals/:id/:medal", (req, res) => {
  Quiz.update({ medals: Sequelize.literal('medals + 1') }, { where: { id: req.params.id } })
    .then(result => res.send(result))
    .catch(err => res.send(err));
})

  

quiz.put("/closeQuiz/:id/", (req, res) => {
  Quiz.update({ rank: Sequelize.literal('rank + 1') }, { where: { id: req.params.id } })
    .then(result => res.send(result))
    .catch(err => res.send(err));
})

quiz.get('/topQuizzesBySubject', (req,res) => {
  Quiz.findAll({
    attributes: [[Sequelize.fn('count', Sequelize.col('subjectId')), 'subjectsCount']],
    include: [{model: Subject, attributes: ['name']}],
        group: 'subjectId',
        order:  Sequelize.literal('count(subjectId) DESC'),
    
  }).then(quiz => res.json(quiz))
})

quiz.get('/topQuizzesByLevel', (req,res) => {
  Quiz.findAll({
    attributes: [[Sequelize.fn('count', Sequelize.col('levelId')), 'levelCount']],
    include: [{model: Level, attributes: ['name']}],
        group: 'levelId',
        order:  Sequelize.literal('count(levelId) DESC'),
    
  }).then(quiz => res.json(quiz))
})

quiz.get('/topQuizzesByUsers', (req,res) => {
  Quiz.findAll({
    attributes: [[Sequelize.fn('count', Sequelize.col('userId')), 'userCount']],
    include: [{model: User, attributes: ['firstname','lastname']}],
        group: 'userId',
        order:  Sequelize.literal('count(userId) DESC'),
        limit: 100
    
  }).then(quiz => res.json(quiz))
})

quiz.get('/countQuizzes', (req,res) => {
  Quiz.count('id').then(quiz => res.json(quiz))
})

quiz.get('/quizPlayedSum', (req,res) => {
  Quiz.sum('played').then(quiz => res.json(quiz))
})



quiz.get("/:id", (req, res) => {
  Quiz.findByPk(req.params.id, {
    order: Sequelize.fn("RAND"),
    include: [
      { model: Subject },
      { model: Level },
      {
        model: Question,

        include: { model: Answer }
      }
    ]
  })
    .then(quiz => {
      if (!quiz) {
        return res.status(404).json({ message: "Quiz Not Found" });
      }
      return res.status(200).json(quiz);
    })
    .catch(error => res.status(400).send(error));
});

quiz.get("/", (req, res) => {
  Quiz.findAll({
    include: [{ model: Subject }, { model: Level }, {model: User, attributes: ['firstname', 'lastname']}]
  }).then(quiz => res.json(quiz));
});

quiz.delete('/:id',(req,res) => {
  Quiz.destroy({where: {id: req.params.id}}).then(quiz => res.json({status: 'quiz id :' +quiz.id+'has been deleted'}))
})


module.exports = quiz;