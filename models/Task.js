const Sequelize = require('sequelize');
const sequelize = require('../server/database.js');

const Task = sequelize.define('tasks',{
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    due:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    description:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    class:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    status:{
        type: Sequelize.STRING,
        allowNull: false,
    },
});

Task.sync();

module.exports = Task;