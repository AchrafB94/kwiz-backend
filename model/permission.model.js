const Sequelize = require("sequelize")
const db = require("../config/db")

module.exports = db.sequelize.define(
    'permission',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        roleId: {
            type: Sequelize.INTEGER,
            references: 'roles',
            referencesKey: 'id' 
        },
        ruleId: {
            type: Sequelize.INTEGER,
            references: 'rules',
            referencesKey: 'id' 
        }

    },
)