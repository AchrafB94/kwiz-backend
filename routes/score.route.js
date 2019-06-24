const express = require("express")
const scores = express.Router()
const cors = require('cors')
const Sequelize = require("sequelize");
const Op = Sequelize.Op
const Score = require("../model/score.model")
const User = require("../model/user.model")
const School = require("../model/school.model")
const Subject = require("../model/subject.model")
const Quiz = require("../model/quiz.model")
const Level = require("../model/level.model")

 
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


User.hasMany(Score);
Score.belongsTo(User);

School.hasMany(Score);
Score.belongsTo(School);

Subject.hasMany(Score);
Score.belongsTo(Subject);

Quiz.hasMany(Score);
Score.belongsTo(Quiz);

Level.hasMany(Score);
Score.belongsTo(Level);

scores.use(cors())

scores.post('/', (req, res) => {
    
    const scoreData = {
        quizId: req.body.quizId,
        userId: req.body.userId,
        schoolId: req.body.schoolId,
        levelId: req.body.levelId,
        subjectId: req.body.subjectId,
        score: req.body.score,
        time: req.body.time,
        percentage: req.body.percentage,
        medal: req.body.medal
    }
    Score.create(scoreData)
    .then(score => {
        res.json({ status: 'score id: ' + score.id + ' added' })
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

scores.get('/count',(req,res) => {
   Score.count().then(count => res.json(count))
})


scores.get('/new',(req,res) => {
    Score.findAll({
        limit: 10,
        order: [ ['createdAt', 'DESC']],
        include: [{model: User, attributes: ['id','firstname','lastname']}, {model: Level, attributes: ['id','name']}, {model: Subject, attributes: ['id','name']}, {model: Quiz, attributes: ['id','name']}]
    }).then(score => res.json(score))
})

scores.get('/filter/:levelId/:subjectId',(req,res) => {
    Score.findAll({
        where: {levelId: req.params.levelId, subjectId: req.params.subjectId},
        order: [ ['createdAt', 'DESC']],
        include: [{model: User, attributes: ['id','firstname','lastname']}, {model: Level, attributes: ['id','name']}, {model: Subject, attributes: ['id','name']}, {model: Quiz, attributes: ['id','name']}]
    }).then(score => res.json(score))
})

scores.get('/filter/:levelId/',(req,res) => {
    Score.findAll({
        where: {levelId: req.params.levelId},
        order: [ ['createdAt', 'DESC']],
        include: [{model: User, attributes: ['id','firstname','lastname']}, {model: Level, attributes: ['id','name']}, {model: Subject, attributes: ['id','name']}, {model: Quiz, attributes: ['id','name']}]
    }).then(score => res.json(score))
})


scores.get('/checkWinner/:quizId/:userId',(req,res) => {
    Score.count({
        where: {userId: req.params.userId, 
            quizId: req.params.quizId, 
            createdAt: {[Op.gte]: lastWeek()},
            percentage: 100, 
            
        }
        
            
    }).then(score => score > 0 ? res.send(true) : res.send(false) )
})


scores.get('/lastThreeWinners',(req,res) => {
    Score.findAll({
        attributes: ['id','medal','score','time'],
        where: {
            [Op.or]: [{medal: '100'}, {medal: '10'}, {medal: '1'}]
        },
        include: [ { model: User, attributes: ['id','firstname','lastname','image','classroom']} , {model: Subject, attributes: ['id','name']}, {model: School, attributes: ['id','name']} ],
        limit: 3,
        order: [ ['id', 'DESC']]
    }).then(score => res.json(score))
})

scores.get('/schoolsByScore',(req,res) => {
    Score.findAll({
        attributes:  [[Sequelize.fn('sum', Sequelize.col('score')), 'total_score']], 
        include: [{model: School, attributes: ['id','name']}],
        group: 'schoolId',
        order:  Sequelize.literal('sum(score) DESC'),
        limit: 100

        
    }).then(score => res.json(score))
})

scores.get('/topSchoolsThisWeek',(req,res) => {
    Score.findAll({
        where:     {createdAt: {[Op.gte]: lastWeek(),  
        }},
        attributes:  [[Sequelize.fn('sum', Sequelize.col('score')), 'total_score']], 
        include: [{model: School, attributes: ['id','name']}],
        group: 'schoolId',
        order:  Sequelize.literal('sum(score) DESC'),
        limit: 5

        
    }).then(score => res.json(score))
})

scores.get('/medals/:schoolId',(req,res) => {
    Score.findAll({
        where: {schoolId: req.params.schoolId},        
        attributes:  [[Sequelize.fn('sum', Sequelize.col('medal')), 'total_medals']],

        
    }).then(score => res.json(score))
})

scores.get("/usermedalsbyschool/:id", (req,res) => {
    Score.findAll({where: {schoolId: req.params.id},
    attributes:  [[Sequelize.fn('sum', Sequelize.col('medal')), 'total_medals']],
    include: {model: User, attributes: ['id','firstname','lastname']} ,
    group: 'userId',
    order:  Sequelize.literal('sum(medal) DESC'),
})
.then(score => res.json(score))
  })


scores.get('/schoolsByMedals',(req,res) => {
    Score.findAll({        
        attributes:  [[Sequelize.fn('sum', Sequelize.col('medal')), 'total_medals']],
        include: [{model: School, attributes: ['id','name']}],
        group: 'schoolId',
        order:  Sequelize.literal('sum(medal) DESC'),
        limit: 100

        
    }).then(score => res.json(score))
})


scores.get('/schoolsByLevel/:levelId',(req,res) => {
    Score.findAll({
        where: {levelId: req.params.levelId} ,
        attributes:  [[Sequelize.fn('sum', Sequelize.col('score')), 'total_score']], 
        include: [{model: School, attributes: ['id','name']}],
        group: 'schoolId',
        order:  Sequelize.literal('sum(score) DESC'),
        limit: 100

        
    }).then(score => res.json(score))
})
scores.get('/schoolsBySubject/:subjectId',(req,res) => {
    Score.findAll({
        where: {subjectId: req.params.subjectId} ,
        attributes:  [[Sequelize.fn('sum', Sequelize.col('score')), 'total_score']], 
        include: [{model: School, attributes: ['id','name']}],
        group: 'schoolId',
        order:  Sequelize.literal('sum(score) DESC'),
        limit: 5

        
    }).then(score => res.json(score))
})


scores.get('/usersByScore',(req,res) => {
    Score.findAll({
        attributes:  [[Sequelize.fn('sum', Sequelize.col('score')), 'total_score']], 
        include: [{model: User, attributes: ['id','firstname','lastname']}, {model: Level}, {model: School, attributes: ['id','name']}],
        group: 'userId',
        order:  Sequelize.literal('sum(score) DESC'),
        limit: 100

        
    }).then(score => res.json(score))
})

scores.get('/usersByParticipations',(req,res) => {
    Score.findAll({
        attributes:  [[Sequelize.fn('count', Sequelize.col('score')), 'played']], 
        include: [{model: User, attributes: ['id','firstname','lastname']}, {model: School, attributes: ['id','name']}],
        group: 'userId',
        order:  Sequelize.literal('count(score) DESC'),
        limit: 100

        
    }).then(score => res.json(score))
})

scores.get('/topUsersThisWeek',(req,res) => {
    Score.findAll({
        where:     {createdAt: {[Op.gte]: lastWeek(), 
        }},
        attributes:  [[Sequelize.fn('sum', Sequelize.col('score')), 'total_score']], 
        include: [{model: User, attributes: ['id','firstname','lastname']}],
        group: 'userId',
        order:  Sequelize.literal('sum(score) DESC'),
        limit: 5
    }).then(score => res.json(score))
})

scores.get('/usersByMedals',(req,res) => {
    Score.findAll({        
        attributes:  [[Sequelize.fn('sum', Sequelize.col('medal')), 'total_medals']],
        include: [{model: User, attributes: ['id','firstname','lastname']}, {model: School, attributes: ['id','name']}],
        group: 'userId',
        order:  Sequelize.literal('sum(medal) DESC'),
        limit: 100

        
    }).then(score => res.json(score))
})
scores.get('/usersByLevel/:levelId',(req,res) => {
    Score.findAll({
        where: {levelId: req.params.levelId} ,
        attributes:  [[Sequelize.fn('sum', Sequelize.col('score')), 'total_score']], 
        include: [{model: User, attributes: ['id','firstname','lastname']}, {model: School}],
        group: 'userId',
        order:  Sequelize.literal('sum(score) DESC'),
        limit: 100

        
    }).then(score => res.json(score))
})

scores.get('/usersBySubject/:subjectId',(req,res) => {
    Score.findAll({
        where: {subjectId: req.params.subjectId} ,
        attributes:  [[Sequelize.fn('sum', Sequelize.col('score')), 'total_score']], 
        include: [{model: User, attributes: ['id','firstname','lastname']}],
        group: 'userId',
        order:  Sequelize.literal('sum(score) DESC'),
        limit: 5

        
    }).then(score => res.json(score))
})

scores.get('/userSumScore/:userId', (req,res) => {
    Score.sum('score', {
        where: {userId: req.params.userId}
    }).then(score => res.json(score))
})

scores.get('/userCountScore/:userId', (req,res) => {
    Score.count({
        where: {userId: req.params.userId}
    }).then(score => res.json(score))
})

scores.get('/userSumMedals/:userId', (req,res) => {
    Score.sum('medal', {
        where: {userId: req.params.userId}
    }).then(score => res.json(score))
})
scores.get('/schoolSumMedals/:schoolId', (req,res) => {
    Score.sum('medal', {
        where: {schoolId: req.params.schoolId}
    }).then(score => res.json(score))
})

scores.get('/userAverage/:userId', (req,res) => {
    Score.findAll({
        attributes: [[Sequelize.fn('AVG', Sequelize.col('percentage')), 'percentage_avg']],
        where: {userId: req.params.userId}}).then(score => res.json(score))
})

scores.get('/userFavoriteSubject/:userId',(req,res) => {
    Score.findAll({
        where: {userId: req.params.userId} ,
        attributes:  [[Sequelize.fn('count', Sequelize.col('subjectId')), 'played']], 
        include: [{model: Subject, attributes: ['name']}],
        group: 'subjectId',
        order:  Sequelize.literal('count(subjectId) DESC'),
        limit: 1

        
    }).then(score => res.json(score))
})

scores.get('/quizwinners/:quizId/',(req,res) => {
    Score.findAll({    
        where: {quizId: req.params.quizId, [Op.or]: [{medal: '100'}, {medal: '10'}, {medal: '1'}] },    
        include: [{model: User, attributes: ['id','firstname','lastname']}, {model: School}],
        order: Sequelize.literal('createdAt DESC'),
        limit: 10
    }).then(score => res.json(score))
})

scores.get('/winners/:subjectId/:levelId',(req,res) => {
    Score.findAll({    
        where: {subjectId: req.params.subjectId, levelId: req.params.levelId},    
        attributes:  [[Sequelize.fn('sum', Sequelize.col('medal')), 'total_medals']],
        include: [{model: User, attributes: ['id','firstname','lastname']}, {model: School}],
        group: 'userId',
        order:  Sequelize.literal('sum(medal) DESC'),
        limit: 5

        
    }).then(score => res.json(score))
})

scores.get('/popularSubjects',(req,res) => {
    Score.findAll({
        
        attributes:  [[Sequelize.fn('count', Sequelize.col('subjectId')), 'played']], 
        include: [{model: Subject, attributes: ['name']}],
        group: 'subjectId',
        order:  Sequelize.literal('count(subjectId) DESC'),
        limit: 10

        
    }).then(score => res.json(score))
})

scores.get('/popularQuizzes',(req,res) => {
    Score.findAll({
        
        attributes:  [[Sequelize.fn('count', Sequelize.col('quizId')), 'played'],'id'], 
        include: [{model: Quiz, attributes: ['name']}],
        group: 'quizId',
        order:  Sequelize.literal('count(quizId) DESC'),
        limit: 10

        
    }).then(score => res.json(score))
})

scores.get('/',(req,res) => {
    Score.findAll({
        order: [ ['createdAt', 'DESC']],
        include: [{model: User, attributes: ['id','firstname','lastname']}, {model: School, attributes: ['id','name']}, {model: Subject, attributes: ['id','name']}, {model: Level, attributes: ['id','name']}, {model: Quiz, attributes: ['id','name']}]
    }).then(score => res.json(score))
})

scores.delete('/reset/:userId',(req,res) => {
    Score.destroy({where: {userId: req.params.userId}}).then(affectedRows => {
        res.json(affectedRows)
    })
})

module.exports = scores