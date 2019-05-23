const Sequelize = require("sequelize")
const db = require("../config/db")

module.exports = db.sequelize.define(
    'rule',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING,
        }

    }
)