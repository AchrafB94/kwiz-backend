const Sequelize = require("sequelize")
const db = require("../config/db")

module.exports = db.sequelize.define(
    'question',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quizId: {
            type: Sequelize.INTEGER,
            references: 'quiz',
            referencesKey: 'id' 
        },
        text: {
            type: Sequelize.STRING,
        }

    },
    {
        timestamps: false
    }
)

