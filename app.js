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

//Links para Quando o Usuário Não Está Logado
const navbarLinksNaoLogado = [
    { text: 'Login', url: '/' },
    { text: 'Cadastro', url: '/register' },
];

//Links para Quando o Usuário Está Logado
const navbarLinksLogado = [
    { text: 'ToDo', url: '/todo' },
    { text: 'Criar Tarefa', url: '/create' },
    { text: 'Editar Tarefa', url: '/edit' }
];

//Todos os Links
const navbarLinksTestes = [
    { text: 'Login', url: '/' },
    { text: 'Cadastro', url: '/register' },
    { text: 'ToDo', url: '/todo' },
    { text: 'Criar Tarefa', url: '/create' },
    { text: 'Editar Tarefa', url: '/edit' },
    { text: 'Ver Tarefa', url: '/view' }
];



//ROTAS
//LOGIN
app.get("/", (req, res) => {
    res.render("usuario/login", {title: "Login",  navbarLinks: navbarLinksTestes})
})

//CADASTRO
app.get("/register", (req, res) => {
    res.render("usuario/register", {title: "Cadastro",  navbarLinks: navbarLinksTestes})
})

//LISTAGEM
app.get("/todo", (req, res) => {
    res.render("todo", {title: "ToDo List",  navbarLinks: navbarLinksTestes})
})

//EDITAR TAREFA
app.get("/edit", (req, res) => {
    res.render("edit", {title: "Editar Tarefa",  navbarLinks: navbarLinksTestes})
})

//CRIAR TAREFA
app.get("/create", (req, res) => {
    res.render("create", {title: "Criar Tarefa", navbarLinks: navbarLinksTestes})
})

app.get("/view", (req, res) => {
    res.render("view", {title: "Ver tarefa", navbarLinks: navbarLinksTestes})
})

//Iniciando Servidor: localhost:8081
app.listen(8081, function(){
    console.log("Servidor Ativo na Porta 8081!")
})