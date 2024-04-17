const Sequelize = require('sequelize');
const sequelize = require('../server/banco.js');

const Atribuicao = sequelize.define('atribuicoes',{
    titulo:{
        type: Sequelize.STRING
    },
    vencimento:{
        type: Sequelize.STRING
    },
    descricao:{
        type: Sequelize.STRING
    },
    materia:{
        type: Sequelize.STRING
    },
    situacao:{
        type: Sequelize.STRING
    },
})

Atribuicao.sync()

module.exports = Atribuicao