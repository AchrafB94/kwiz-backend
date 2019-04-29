const Sequelize = require("sequelize")
const db = require("../config/db")

module.exports = db.sequelize.define(
    'quiz',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,

        },
        subjectId: {
            type: Sequelize.INTEGER,
            references: 'subjects',
            referencesKey: 'id' 
        },
        levelId: {
            type: Sequelize.INTEGER,
            references: 'level',
            referencesKey: 'id' 
        },
        userId: {
            type: Sequelize.INTEGER,
            references: 'users',
            referencesKey: 'id' 
        },
        created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        rank: {
            type: Sequelize.INTEGER,
        },
        played: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        medals: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        description: {
            type: Sequelize.STRING
        }


    },
    {
        tableName: 'quiz'
    }
)
