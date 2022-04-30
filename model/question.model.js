const Sequelize = require("sequelize")
const sequelize = require("../config/db")

module.exports = sequelize.define(
    'question',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quizId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'quiz',
                key: 'id'
            }
        },
        type: {
            type: Sequelize.BOOLEAN
        },
        text: {
            type: Sequelize.STRING,
        }

    }
)