const Sequelize = require("sequelize")
const db = require("../config/db")

module.exports = db.sequelize.define(
    'user',
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
            type: Sequelize.NUMBER
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
        class: {
            type: Sequelize.STRING,
        },
        image: {
            type: Sequelize.STRING,
        },
        roleId: {
            type: Sequelize.INTEGER,
        },
        levelId: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.STRING,
        }

    },
)