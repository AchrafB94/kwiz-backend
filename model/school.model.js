const Sequelize = require("sequelize")
const sequelize = require("../config/db")

module.exports = sequelize.define(
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
        address: {
            type: Sequelize.STRING,
        },
        region: {
            type: Sequelize.STRING,
        },
        country: {
            type: Sequelize.STRING,
        },

    }
)