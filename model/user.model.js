const Sequelize = require("sequelize")
const sequelize = require("../config/db")

module.exports = sequelize.define(
    'users',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        firstname: {
            type: Sequelize.STRING
        },
        lastname: {
            type: Sequelize.STRING
        },
        schoolId: {
            type: Sequelize.NUMBER,
            references: {
                model: 'schools',
                key: 'id'
            }
        },
        birthdate: {
            type: Sequelize.DATE,
        },
        gender: {
            type: Sequelize.STRING,
        },
        phone: {
            type: Sequelize.STRING,
        },
        classroom: {
            type: Sequelize.STRING,
        },
        image: {
            type: Sequelize.STRING,
        },
        roleId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'roles',
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
        status: {
            type: Sequelize.STRING,
        }

    },
)