const express = require("express");
const users = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../model/user.model");
users.use(cors());

process.env.SECRET_KEY = "secret";


users.post("/register", (req, res) => {
  const today = new Date();
  const userData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    created: today
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
        res.json({ error: "User already exists" });
      }
    })
    .catch(err => {
      res.send("error: " + err);
    });
});

users.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            expiresIn: 1440
          });
          res.send(token);
        }
      } else {
        res.status(400).json({ error: "Username or password is not correct" });
      }
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

users.get("/newest", (req, res) => {
  User.findAll({
    limit: 1,
    order: [["created", "DESC"]],
    attributes: ["firstname", "lastname"]
  }).then(user => res.json(user));
});

users.get("/count", (req, res) => {
  User.count().then(count => res.json(count));
});

module.exports = users;
