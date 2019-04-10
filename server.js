var express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
var app = express()

var Users = require('./routes/user.route')
var Scores = require('./routes/score.route')
var Subjects = require('./routes/subject.route')
var Quiz = require('./routes/quiz.route')
var Question = require('./routes/question.route')

app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/users', Users)
app.use('/scores', Scores)
app.use('/subjects', Subjects)
app.use('/quiz', Quiz)
app.use('/questions', Question)



app.listen(4000);
