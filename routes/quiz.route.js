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
const Score = require('../model/score.model')
const nodemailer = require("nodemailer");

var schedule = require('node-schedule');
 


Level.hasMany(Quiz);
Quiz.belongsTo(Level);

Subject.hasMany(Quiz);
Quiz.belongsTo(Subject);

Quiz.hasMany(Score);
Score.belongsTo(Quiz);

Quiz.hasMany(Question);
Question.belongsTo(Quiz);

Question.hasMany(Answer);
Answer.belongsTo(Question);

Quiz.belongsTo(User)
User.hasMany(Quiz)


quiz.use(cors());

function lastWeek()
  {
      
var date = new Date();

var days = date.getDay() - 1
var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
var day =last.getDate();
var month=last.getMonth();
var year=last.getFullYear();

    date = new Date(year,month,day)
    return date
  } 

  var j = schedule.scheduleJob(({hour: 0, minute: 1, dayOfWeek: 0}), function(){
    

    Quiz.findAll( {raw: true}).then(result => {
      result.forEach(quiz => {
        if(quiz.rank === 0) {
          Quiz.count({where: {userId: quiz.userId}}).then(count => Quiz.update({rank: (count-1)},{where: {rank: quiz.rank,id: quiz.id}}))
        } else {
          Quiz.update({rank: Sequelize.literal('rank - 1')},{where: {rank: quiz.rank,id: quiz.id}})
        }
      })

      })
});



quiz.get("/available/", (req, res) => {
  Quiz.findAll({
    where: {rank: 0},
    order: Sequelize.fn("RANDOM"),
    include: [{ model: Subject }, { model: Level }, {model: User, attributes: ['id','firstname', 'lastname']}]
  }).then(quiz => res.json(quiz));
});


quiz.get("/user/:userId", (req, res) => {
  Quiz.findAll({
    where: {userId: req.params.userId},
    include: [{ model: Subject }, { model: Level}],
    order:  Sequelize.literal('rank ASC'),
  }).then(quiz => res.json(quiz));
});


quiz.get("/suggest/:subjectId/:currentId", (req, res) => {
  Quiz.findAll({
    where: {subjectId: req.params.subjectId, id: {[Op.ne]: req.params.currentId}},
    order: Sequelize.fn("RANDOM"),
    limit: 3,
    include: [{ model: Subject }, { model: Level }, {model: User, attributes: ['firstname', 'lastname']}]
  }).then(quiz => res.json(quiz));
});


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


quiz.get('/countQuizzes', (req,res) => {
  Quiz.count('id').then(quiz => res.json(quiz))
})



quiz.get("/new", (req, res) => {
  Quiz.findAll({
    order: Sequelize.literal('createdAt DESC'),
    where: {createdAt: {[Op.gte]: lastWeek()}},
    include: [{ model: Subject, attributes: ['id','name'] }, { model: Level, attributes: ['id','name'] }, {model: User, attributes: ['firstname', 'lastname']}]
  }).then(quiz => res.json(quiz));
});

quiz.get("/:id", (req, res) => {
  Quiz.findByPk(req.params.id, {
    order: Sequelize.fn("RANDOM"),
    include: [
      { model: User, attributes: ['firstname','lastname']},
      { model: Subject, attributes: ['id','name'] },
      { model: Level, attributes: ['id','name'] },
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
    order: Sequelize.literal('updatedAt DESC'),
    include: [{ model: Subject }, { model: Level }, {model: User, attributes: ['id','firstname', 'lastname']}]
  }).then(quiz => res.json(quiz));
});

quiz.delete('/:id/:userId/:rank',(req,res) => {
  const rank = req.params.rank
  const userId = req.params.userId

  Quiz.update({rank: Sequelize.literal('rank - 1')},{where: {rank: {[Op.gt]: rank},userId: userId, id: {[Op.not]: req.params.id}}})

 Quiz.destroy({where: {id: req.params.id}})

 .then(quiz =>
  res.json(quiz)).catch(err => {
    res.send('error:'+err)
})




})



quiz.post("/",(req,res) => {

  Quiz.count({where: {userId: req.body.userId}}).then(rank => {
    const quizData = {
      name: req.body.name,
      description: req.body.description,
      userId: req.body.userId,
      levelId: req.body.levelId,
      subjectId: req.body.subjectId,
      rank: rank
    }
  
    const questionsData = req.body.questionsData
  
  
    Quiz.create(quizData).then(quiz => {
  
      questionsData.forEach(question => {
  
        var newQuestionData = {
          quizId: quiz.id,
          text: question.text,
          type: question.type,
          minimum: question.minimum
        }
  
  
        Question.create(newQuestionData).then(result => {
        
        answers = question.answers
  
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
          }) })
  })
  })
  
  })
 
})

quiz.put("/updateMedals/:id/:medal", (req, res) => {
  Quiz.update({ medals: Sequelize.literal('medals + 1') }, { where: { id: req.params.id } })
    .then(result => res.send(result))
    .catch(err => res.send(err));
})

  

quiz.put("/close/:id/", (req, res) => {
  const contribId = req.body.contribId


    Quiz.findOne({where: {id: req.params.id},include: {model: User,attributes: ['id','firstname','lastname','email']},raw: true}).then(quiz => {
      async function main(){
        const transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
              user: 'timmothy7@ethereal.email',
              pass: 'SpkGn4bCWzyYyYS7mF'
          }
      });
  
          // Message object
          let message = {
            from: 'KWIZ <services@kwiz.com>',
            to: quiz['user.firstname']+' '+quiz['user.lastname'] +'<'+quiz['user.email']+'>',
            subject: 'KWIZ: Quiz fermé',
            html: '<h2>Bonjour '+quiz['user.firstname']+' '+quiz['user.lastname']+',</h2>'+
            '<p>Le quiz '+quiz.name+' est fermé aprés la victoire de 3 participants.</p>'+
            '<a href="http://localhost:3000/contrib/" >Cliquez ici</a> pour visiter votre panneau et voir la liste des gangants.',
        };
    
        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return process.exit(1);
            }
    
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
      }
  
      main().catch(console.error);
    })

   

    
    

  Quiz.count({where: {userId: contribId}}).then(count => {
    console.log(count)
    Quiz.update({rank: count,
      medals: 0},{where: {id:  req.params.id}})
      Quiz.update({rank: Sequelize.literal('rank - 1')},{where: {userId: contribId}})
  })
  .then(quiz =>
    res.json(quiz))
  .catch(err => {
      res.send(err)
})





})


quiz.put("/rank/", (req, res) => {

  const userId = req.body.userId
  const position = req.body.position
  const quizId = req.body.quizId


Quiz.update({rank: Sequelize.literal('rank + 1')}, {where: {rank: {[Op.between]: [1,position]}, userId: userId, id: {[Op.ne]: quizId}}})
.then(quiz => res.json(quiz));


})

quiz.put('/:id', (req, res) => {

  Quiz.update({rank: req.body.newRank},{where: {id: req.params.id}})
  Quiz.update({rank: req.body.oldRank},{where: {rank: req.body.newRank,id: {[Op.ne]: req.params.id}}})
  

  Quiz.update(
    {name: req.body.name,
    description: req.body.description,
    levelId: req.body.levelId,
    subjectId: req.body.subjectId},
    
    {where: {id: req.params.id}}
  ).then(quiz => {
    res.json(quiz)
  })
 })

module.exports = quiz;