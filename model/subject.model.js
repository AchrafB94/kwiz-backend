const Sequelize = require("sequelize")
const db = require("../config/db")

module.exports = db.sequelize.define(
    'subject',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
        },
        link: {
            type: Sequelize.STRING
        }

    },
    {
        timestamps: false
    }
)