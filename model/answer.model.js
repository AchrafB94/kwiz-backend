const Sequelize = require("sequelize")
const sequelize = require("../config/db")

module.exports = sequelize.define(
    'answer',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        questionId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'questions',
                key: 'id'
            }
        },
        text: {
            type: Sequelize.STRING,
        },
        isCorrect: {
            type: Sequelize.BOOLEAN
        }

    },    
    {
        tableName: 'answer'
    }
) 