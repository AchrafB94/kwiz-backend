var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
var sequelize = require("./config/db.js");
sequelize.sync();

var Quiz = require("./routes/quiz.route");
var Scores = require("./routes/score.route");
var Subjects = require("./routes/subject.route");
var Question = require("./routes/question.route");
var School = require("./routes/school.route");
var Level = require("./routes/level.route");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/scores", Scores);
app.use("/subjects", Subjects);
app.use("/quiz", Quiz);
app.use("/questions", Question);
app.use("/schools", School);
app.use("/levels", Level);

var Users = require("./routes/user.route");
app.use("/users", Users);

const PORT = 4000;

app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running at port " + PORT);
});
