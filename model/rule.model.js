const Sequelize = require("sequelize")
const sequelize = require("../config/db")

module.exports = sequelize.define(
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