const Sequelize = require("sequelize")
const sequelize = require("../config/db")

module.exports = sequelize.define(
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
            references: {
                model: 'subjects',
                key: 'id'
            }
        },
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        levelId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'levels',
                key: 'id'
            }
        },
        rank: {
            type: Sequelize.INTEGER,
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
