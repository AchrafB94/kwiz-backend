const express = require("express");
const quiz = express.Router();
const cors = require("cors");

const Subject = require("../model/subject.model");
const Level = require("../model/level.model");
const Quiz = require("../model/quiz.model");
const Question = require("../model/question.model");
const Answer = require("../model/answer.model");

Level.hasMany(Quiz);
Quiz.belongsTo(Level);

Subject.hasMany(Quiz);
Quiz.belongsTo(Subject);

Quiz.hasMany(Question);
Question.belongsTo(Quiz);

Question.hasMany(Answer);
Answer.belongsTo(Question);

quiz.use(cors());

quiz.get("/all", (req, res) => {
  Quiz.findAll({
      include: [{model: Subject},{model: Level}]
  }).then(quiz => res.json(quiz));
});

quiz.get("/:id", (req, res) => {
  Quiz.findByPk(req.params.id,
    {
    include: [
      {model: Subject},
      {model: Level},
      {model: Question,
      include: {model: Answer}}
        ]
      
        
      }).then(quiz => {
        if (!quiz){
          return res.status(404).json({message: "Quiz Not Found"})
        }
        return res.status(200).json(quiz)
      }
    )
    .catch(error => res.status(400).send(error));
});

module.exports = quiz;

/*
// CREATE QUIZ
app.post('/quiz', (request, response) => {         
var data = request.body  // récupérer le body de la requête envoyée          
connection.query('insert into quiz values (null, ? , ? , ?) ',  [data.name, data.subject, data.level ] , (error, results) => {         
if (error) throw error;         
response.send(results)     
})     
}) 
 
// UPDATE QUIZ  
app.put('/quiz', (request, response) => {     
var data= request.body  // récupérer le body de la requête envoyée          
connection.query('update quiz set name = ? , subject = ? , level = ? where id = ? ',       
[data.name, data.subject, data.level, data.id] , (error, results) => {         
if (error) throw error;         
response.send(results)     
})     
}) 

// DELETE QUIZ  
app.delete('/quiz', (request, response) => {     
var data= request.body // récupérer le body de la requête envoyée          
connection.query('delete from quiz where id = ? ', [data.id] , (error, results) => {        
if (error) throw error;         
response.send("Quiz supprimé avec succès ")     
})     
}) 
*/
