const Sequelize = require("sequelize")
const db = require("../config/db")

module.exports = db.sequelize.define(
    'answer',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        questionId: {
            type: Sequelize.INTEGER,
            references: 'questions',
            referencesKey: 'id' 
        },
        text: {
            type: Sequelize.STRING,
        },
        isCorrect: {
            type: Sequelize.BOOLEAN
        }

    }
) 