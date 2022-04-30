const Sequelize = require("sequelize")
const sequelize = require("../config/db")

module.exports = sequelize.define(
    'permission',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        roleId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'roles',
                key: 'id'
            }
        },
        ruleId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'roles',
                key: 'id'
            }
        }

    },
)