const Sequelize = require("sequelize")
const db = require("../config/db")

module.exports = db.sequelize.define(
    'school',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
        },

    }
)