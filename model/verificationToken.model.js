const Sequelize = require("sequelize")
const db = require("../config/db")

module.exports = db.sequelize.define(
    'verificationToken',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER,
        },
        token: {
            type: Sequelize.STRING,
        }

    }
)