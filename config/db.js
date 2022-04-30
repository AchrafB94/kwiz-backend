const Sequelize = require("sequelize")
const sequelize = new Sequelize("kwiz", "test","test", {
    storage: './database.sqlite',
    dialect: 'sqlite'
})


module.exports = sequelize 