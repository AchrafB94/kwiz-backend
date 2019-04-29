const Sequelize = require("sequelize")
const db = require("../config/db")

module.exports = db.sequelize.define(
    'score',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quizId: {
            type: Sequelize.INTEGER,
        },
        userId: {
            type: Sequelize.INTEGER,
        },
        schoolId: {
            type: Sequelize.INTEGER,
        },
        subjectId: {
            type: Sequelize.INTEGER,
        },
        levelId: {
            type: Sequelize.INTEGER,
        },
        score: {
            type: Sequelize.INTEGER,
        },
        percentage: {
            type: Sequelize.INTEGER,
        },
        time: {
            type: Sequelize.INTEGER,
        },
        medal: {
            type: Sequelize.INTEGER,
        }



    },
)