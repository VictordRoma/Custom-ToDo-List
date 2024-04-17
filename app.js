//IMPORTANDO BIBLIOTECAS
const express = require("express")
const bodyParser = require('body-parser')
const {allowInsecurePrototypeAccess,} = require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars");
var Atribuicao = require(__dirname + '/models/Atribuicao.js')
var Usuario = require(__dirname + '/models/Usuario.js')
const handlebars = require("express-handlebars").engine

//Iniciando Bibliotecas
const app = express()

//Iniciando Middleware que recolhe os dados do formulário via POST
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Definindo rota dos arquivos complementares
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/public', express.static('public'))
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));

//Definindo layout das páginas
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars")



//ROTAS
//LOGIN
app.get("/", (req, res) => {
    res.render("usuario/login")
})

//CADASTRO
app.get("/register", (req, res) => {
    res.render("usuario/register")
})

//LISTAGEM
app.get("/todo", (req, res) => {
    res.render("todo")
})

//EDITAR TAREFA
app.get("/edit", (req, res) => {
    res.render("edit")
})

//CRIAR TAREFA
app.get("/create", (req, res) => {
    res.render("create")
})



app.listen(8081, function(){
    console.log("Servidor Ativo na Porta 8081!")
})