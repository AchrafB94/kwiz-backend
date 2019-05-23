const express = require("express");
const users = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../model/user.model");
const School = require("../model/school.model");
const Level = require("../model/level.model");

const Permission = require("../model/permission.model");
const Role = require("../model/role.model");
const Rule = require("../model/rule.model");

let fs = require('fs-extra');

var multer = require('multer')




var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage }).single('file')


User.belongsTo(School)
School.hasMany(User)



User.belongsTo(Level)
Level.hasMany(User)

User.belongsTo(Role)
Role.hasMany(User)

Permission.belongsTo(Role)
Role.hasMany(Permission)

Permission.belongsTo(Rule)
Rule.hasMany(Permission)


users.use(cors());

process.env.SECRET_KEY = "secret";

users.post("/register", (req, res) => {
  const userData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    schoolId: req.body.schoolId,
    birthdate: req.body.birthdate,
    gender: req.body.gender,
    phone: req.body.phone,
    levelId: req.body.levelId,
    class: req.body.class,
    image: req.body.image,
    permission: 0,
  };

  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash;
          User.create(userData)
            .then(user => {
              res.json({ status: user.email + " registered" });
            })
            .catch(err => {
              res.send("error: " + err);
            });
        });
      } else {
        res.json({ code: 10 });
      }
    })
    .catch(err => {
      res.send(err);
    });
});



users.post('/upload',function(req, res) {
     
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)

    })

});


users.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    },
    include: {model: Role, include: [{model: Permission}]}
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            expiresIn: 1440
          });
          res.send(token);
        }else {
          res.status(400).json({ error: "Username or password is not correct"});
        }
      } else {
        res.status(400).json({ code: "Username or password is not correct"});
      }
    })
    .catch(err => {
      res.send(err);
    });
});


users.get("/new/", (req, res) => {
  User.findAll({
    limit: 15,
    order: [["createdAt", "DESC"]],
    attributes: ["id","firstname", "lastname","image"],
    include: {model: School, attributes: ['id','name']}
  }).then(user => res.json(user));
});

users.get("/newest/", (req, res) => {
  User.findAll({
    limit: 1,
    order: [["createdAt", "DESC"]],
    attributes: ["id","firstname", "lastname"]
  }).then(user => res.json(user));
});

users.get("/permission/",(req,res) => {
 Permission.findOne({where: {roleId: req.body.roleId,ruleId: req.body.ruleId},include: [{model: Rule, attributes: ['name']}]})
  .then(permission => permission ? res.json({code: 110} ) : res.json({code: 120}))
  .catch(err => res.json(err))
})


users.get("/count", (req, res) => {
  User.count().then(count => res.json(count));
});

users.get("/:id",(req,res) => {
  User.findByPk(req.params.id,
    {include: [{model: School}, {model: Level},{model: Role, include: [{model: Permission}]}]}).then(user => res.json(user))
})

users.get("/",(req,res) => {
  User.findAll({include: [{model: School},{model: Level}]}).then(user => res.json(user))
})


users.put('/image/:id/', function (req, res, next) {

  User.update({
    image: req.body.filename},
    {where: {id: req.params.id}}
  )
  .then(function(rowsUpdated) {
    res.json(rowsUpdated)
  })
  .catch(next)
 })

users.put('/:id', function (req, res, next) {
  User.update(
    {firstname: req.body.firstname,
    lastname: req.body.lastname,
    birthdate: req.body.birthdate,
    phone: req.body.phone,
    gender: req.body.gender,
    image: req.body.image,
    levelId: req.body.levelId,
  schoolId: req.body.schoolId},
    {where: {id: req.params.id}}
  )
  .then(function(rowsUpdated) {
    res.json(rowsUpdated)
  })
  .catch(next)
 })


 users.get('/',(req,res) => {
   User.findAll().then(user => res.json(user))
 })
 
 users.put('/permission/:id/:level',(req,res) => {
   User.update(
    {permission: req.params.level},
    {where: {id: req.params.id}}
    )
 })

 
 

module.exports = users;
