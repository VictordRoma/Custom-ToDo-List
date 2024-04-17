const Sequelize = require('sequelize');
const sequelize = require('../server/banco.js');

const Usuario = sequelize.define('usuarios',{
    usuario:{
        type: Sequelize.STRING
    },
    senha:{
        type: Sequelize.STRING
    },
})

Usuario.sync()

module.exports = Usuario