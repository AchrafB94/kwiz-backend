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
        created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
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
        district: {
            type: Sequelize.STRING,
        },
        city: {
            type: Sequelize.STRING,
        },
        province: {
            type: Sequelize.STRING,
        },
        image: {
            type: Sequelize.STRING,
        },
        permission: {
            type: Sequelize.INTEGER,
        },
        levelId: {
            type: Sequelize.INTEGER
        }

    },
    {
        timestamps: false
    }
)