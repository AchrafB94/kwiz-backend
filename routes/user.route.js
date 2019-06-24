const express = require("express");
const users = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto-random-string");
const User = require("../model/user.model");
const School = require("../model/school.model");
const Level = require("../model/level.model");
const Permission = require("../model/permission.model");
const Role = require("../model/role.model");
const Rule = require("../model/rule.model");
const Score = require("../model/score.model");
const VerificationToken = require("../model/verificationToken.model");
const nodemailer = require("nodemailer");
let fs = require("fs-extra");
var multer = require("multer");

var verifyToken = require('../config/verifyToken');



const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "timmothy7@ethereal.email",
    pass: "SpkGn4bCWzyYyYS7mF"
  }
});


var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/images");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage }).single("file");

User.belongsTo(School);
School.hasMany(User);

Score.belongsTo(User);
User.hasMany(Score);

User.belongsTo(Level);
Level.hasMany(User);

User.belongsTo(Role);
Role.hasMany(User);

Permission.belongsTo(Role);
Role.hasMany(Permission);

Permission.belongsTo(Rule);
Rule.hasMany(Permission);

users.use(cors());

process.env.SECRET_KEY = "secret4takentechs";

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
    classroom: req.body.classroom,
    image: req.body.image,
    status: "unverified",
    roleId: 1
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

              VerificationToken.create({
                userId: user.id,
                token: crypto({ length: 10 })
              }).then(token => {
                let message = {
                  from: "KWIZ <services@kwiz.com>",
                  to:
                    user.firstname +
                    " " +
                    user.lastname +
                    "<" +
                    user.email +
                    ">",
                  subject: "KWIZ: Confirmation de création de compte",
                  html:
                    "<h2>Bonjour " +
                    user.firstname +
                    " " +
                    user.lastname +
                    ",</h2>" +
                    "<p>Votre demande de création de compte KWIZ a été traitée.</p>" +
                    "<p>Vous devez maintenant cliquer sur le lien suivant :</p>" +
                    '<a href="http://localhost:3000/confirm/' +
                    token.token +
                    '">http://localhost:3000/confirm/' +
                    token.token +
                    "</a>" +
                    "<p>Si le lien ne s'affiche pas correctement, copier le texte ci-dessus dans la barre de votre navigateur.</p>"
                };

                transporter.sendMail(message, (err, info) => {
                  if (err) {
                    console.log("Error occurred. " + err.message);
                    return process.exit(1);
                  }

                  console.log("Message sent: %s", info.messageId);
                  // Preview only available when sending through an Ethereal account
                  console.log(
                    "Preview URL: %s",
                    nodemailer.getTestMessageUrl(info)
                  );
                });
              });
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

users.post("/upload", verifyToken, function(req, res) {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

users.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    },
    attributes: ['id','email','password','roleId','schoolId','levelId','status'],
    include: { model: Role, attributes: ['id','name'], include: [{ model: Permission, attributes: ['id','ruleId','roleId'] }] }
  })
    .then(user => {

      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          if(user.status === 'unverified') {
            res.json({code: 1004})

          }
          else if(user.status === 'blocked') {
            res.json({code: 1005})

          }else if (user.status === 'verified') {
            delete user.dataValues.password
            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
              expiresIn: 86400
            });
            res.send(token);
          }


        } else {
          res.json({code: 1001})
        }
      } else {
        res.json({code: 1002})
      }
    })
    .catch(err => {
      res.json({code: 1003, error: err.message})
    });
});

users.post("/confirm/", (req, res) => {
  VerificationToken.findOne({ where: { token: req.body.token } })
    .then(foundToken => {
      if (foundToken) {
        User.update(
          { status: "verified" },
          { where: { id: foundToken.userId } }
        )
          .then(updatedUser => {
            VerificationToken.destroy({ where: { id: foundToken.id } });
            return res.json({code: 1013});
          })
          .catch(reason => {
            return res.json({code: 1014});
          });
      } else {
        return res.json({code: 1015});
      }
    })
    .catch(reason => {
      return res.json({code: 1016,message: reason.message});
    });
});

users.post("/resetpassword/", (req, res) => {

  User.findOne({where: {email: req.body.email}}).then(foundUser => {
    if (foundUser) {

      VerificationToken.create({
        userId: foundUser.id,
        token: crypto({ length: 10 })
      }).then(token => {
        let message = {
          from: "KWIZ <services@kwiz.com>",
          to:
            foundUser.firstname +
            " " +
            foundUser.lastname +
            "<" +
            foundUser.email +
            ">",
          subject: "KWIZ: demande de réinitialisation de mot de passe",
          html:
            "<h2>Bonjour " +
            foundUser.firstname +
            " " +
            foundUser.lastname +
            ",</h2>" +
            "<p>Vous avez demandé la réinitialisation de votre mot de passe associé à votre compte KWIZ.</p>" +
            "<p>Pour cela, veuillez cliquer sur le lien suivant:</p>" +
            '<a href="http://localhost:3000/confirmpassword/'+
            token.token +
            '">http://localhost:3000/confirmpassword/' +
            token.token +
            "</a>" +
            "<p>Si le lien ne s'affiche pas correctement, copier le texte ci-dessus dans la barre de votre navigateur.</p>"
        };

        transporter.sendMail(message, (err, info) => {
          if (err) {
            console.log("Error occurred. " + err.message);
            return process.exit(1);
          }

          console.log("Message sent: %s", info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        });
      });
      return res.json({ code: 1017 });
    } else {
      return res.json({ code: 1018 });
    }
  }).catch(function(error) {
    console.log('There has been a problem with the operation: ' + error.message);
  });
});

users.post("/confirmpasswordreset/", (req, res) => {
  VerificationToken.findOne({ where: { token: req.body.token } })
    .then(foundToken => {
      if (foundToken) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {

          User.update({password: hash}, { where: { id: foundToken.userId } })
          .then(updatedUser => {
            VerificationToken.destroy({ where: { id: foundToken.id } });
            let message = {
              from: "KWIZ <services@kwiz.com>",
              to:
                foundUser.firstname +
                " " +
                foundUser.lastname +
                "<" +
                foundUser.email +
                ">",
              subject: "KWIZ: modification de votre mot de passe",
              html:
                "<h2>Bonjour " +
                foundUser.firstname +
                " " +
                foundUser.lastname +
                ",</h2>" +
                "<p>Votre mot de passe a été modifié avec succès.</p>"
            };
    
            transporter.sendMail(message, (err, info) => {
              if (err) {
                console.log("Error occurred. " + err.message);
                return process.exit(1);
              }
    
              console.log("Message sent: %s", info.messageId);
              // Preview only available when sending through an Ethereal account
              console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            });
            return res.json({code: 1019})
            
          })
          .catch(reason => {
            return res.status(403).json(`Erreur: ` + reason.message);
          });
          
        })

      } else {
        return res.json({code: 1020});
      }
    })
    .catch(reason => {
      return res.status(404).json(`Token expired: ` + reason);
    });
});

users.put("/changepassword/:id",verifyToken, (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  User.findByPk(req.params.id).then(user => {
    if (bcrypt.compareSync(oldPassword, user.password)) {
      bcrypt.hash(newPassword, 10, (err, hash) => {
      User.update({password: hash},{where: {id: user.id}})
      res.json({code: 1011})
    
    })
  } else {
    res.json({code: 1012})
  }
  })
});

users.post("/addcontributor", verifyToken,(req, res) => {
  
  const userData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    roleId: 2,
    status: "verified"
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
              res.json(user);
            })
            .catch(err => {
              res.send("error: " + err);
            });
        });
      } else {
        res.json({ code: 1006 });
      }
    })
    .catch(err => {
      res.send(err);
    });
});

users.get("/new/", verifyToken, (req, res) => {
  User.findAll({
    where: {roleId: 1},
    limit: 15,
    order: [["createdAt", "DESC"]],
    attributes: ["id", "firstname", "lastname", "image"],
    include: { model: School, attributes: ["id", "name"] }
  }).then(user => res.json(user));
});

users.get("/newest/",verifyToken, (req, res) => {
  User.findAll({
    limit: 1,
    order: [["createdAt", "DESC"]],
    attributes: ["id", "firstname", "lastname"]
  }).then(user => res.json(user));
});

users.get("/permission/",verifyToken, (req, res) => {
  Permission.findOne({
    where: { roleId: req.body.roleId, ruleId: req.body.ruleId },
    include: [{ model: Rule, attributes: ["name"] }]
  })
    .then(permission =>
      permission ? res.json({ code: 110 }) : res.json({ code: 120 })
    )
    .catch(err => res.json(err));
});

users.get("/count", verifyToken,(req, res) => {
  User.count().then(count => res.json(count));
});

users.get("/:id",verifyToken, (req, res) => {
  User.findByPk(req.params.id, {
    include: [
      { model: School },
      { model: Level },
      { model: Role, include: [{ model: Permission }] }
    ]
  }).then(user => res.json(user));
});

users.get("/",verifyToken, (req, res) => {
  User.findAll({ include: [{ model: School }, { model: Level }] }).then(user =>
    res.json(user)
  );
});

users.put("/image/:id/", verifyToken, function(req, res, next) {
  User.update(
    {
      image: req.body.filename
    },
    { where: { id: req.params.id } }
  )
    .then(function(rowsUpdated) {
      res.json(rowsUpdated);
    })
    .catch(next);
});

users.put("/block/:id/",verifyToken, (req, res) => {
  console.log(req.params.id)
  User.update({ status: "blocked" }, { where: { id: req.params.id } }).then(
    user => res.json(user)
  );
});

users.put("/unblock/:id/",verifyToken, (req, res) => {
  User.update({ status: "verified" }, { where: { id: req.params.id } }).then(
    user => res.json(user) );
});

users.put("/:id", verifyToken, function(req, res, next) {
  User.update(
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      birthdate: req.body.birthdate,
      phone: req.body.phone,
      gender: req.body.gender,
      image: req.body.image,
      levelId: req.body.levelId,
      schoolId: req.body.schoolId,
      classroom: req.body.classroom
    },
    { where: { id: req.params.id } }
  )
    .then(function(rowsUpdated) {
      res.json(rowsUpdated);
    })
    .catch(next);
});

users.get("/",verifyToken, (req, res) => {
  User.findAll({order: Sequelize.literal('id ASC')}).then(user => res.json(user));
});

users.delete("/:id",verifyToken, (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(user => {
      res.json({ status: "user id :" + user.id + "has been deleted" });
    })
    .catch(err => {
      res.send("error:" + err);
    });
});

module.exports = users;
