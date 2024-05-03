//IMPORTANDO BIBLIOTECAS
const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
const {allowInsecurePrototypeAccess,} = require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars");
var Task = require(__dirname + '/models/Task.js');
var User = require(__dirname + '/models/User.js');
const handlebars = require("express-handlebars").engine;
const notifier = require('node-notifier');
const post = require("./models/Task")

//Iniciando Bibliotecas
const app = express();

//Iniciando Sessions
app.use(session({
    secret: 'key',
    resave: true,
    saveUninitialized: true
}));

//Iniciando Middleware que recolhe os dados do formulário via POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Definindo rota dos arquivos complementares
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/public', express.static('public'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));

//Definindo layout das páginas
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars");



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
//VIEW LOGIN
app.get("/", (req, res) => {
    if (req.session.user) {
        return res.redirect("/todo");
    }

    return res.render("user/login", {title: "Login", a: 'as'});
});

//LOGAR
app.post('/login', async (req, res) => {
    if (req.session.user) {
        return res.redirect("/todo");
    }

    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !await user.validPassword(password)) {
        notifier.notify({
            title: 'Erro!',
            message: 'Credenciais Incorretas!',
            sound: false,
            wait: true
        })

        return res.redirect("/");
    }

    req.session.user = user;

    notifier.notify({
        title: 'Logado!',
        message: 'Você foi Logado com Sucesso!',
        sound: false,
        wait: true
    })

    return res.redirect("/todo");
});

//DESLOGAR
app.get("/logout", (req, res) => {
    req.session.destroy((e) => {
        if (e) {
            return res.redirect("/todo");
        }

        notifier.notify({
            title: 'Deslogado!',
            message: 'Você foi deslogado do sistema!',
            sound: false,
            wait: true
        })

        return res.redirect("/");
    });
});



//VIEW CADASTRO DE USUÁRIO
app.get("/register", (req, res) => {
    if (req.session.user) {
        return res.redirect("/todo");
    }

    return res.render("user/register", {title: "Cadastro",  navbarLinks: navbarLinksTestes});
});

//CADASTRAR USUÁRIO
app.post('/register', async (req, res) => {
    if (req.session.user) {
        return res.redirect("/todo");
    }

    const { username, password } = req.body;
    try {
        const newUser = await User.create({ username, password });
        req.session.user = newUser;

        notifier.notify({
            title: 'Cadastrado!',
            message: 'Você foi Cadastrado com Sucesso!',
            sound: false,
            wait: true
        })

        return res.redirect("/todo");
    } catch (error) {
        notifier.notify({
            title: 'Erro!',
            message: 'Ocorreu um Erro ao criar Usuário!',
            sound: false,
            wait: true
        })
        return res.redirect("/register");
    }
});



//LISTAGEM
app.get("/todo", (req, res) => {
    if (!req.session.user) {
        return res.render("errors/erro", {error: "403", textError: 'Você não tem permissão para acessar essa página!'});
    }
    post.findAll({where: {status: "Incompleta"}}).then(function(post){
        return res.render("todo", {post, navbarLinks: navbarLinksTestes})
    }).catch(function(erro){
        console.log("Erro ao carregar dados do banco: " + erro)
    })    
});

//COMPLETAR
app.get("/completar/:id", function(req, res){
    post.update({
        status: "Completa"
    },{
        where: {
            'id': req.params.id
        }
    }).then(function(){
        res.redirect("/todo")
    })
})

//VIEW EDITAR TAREFA
app.get("/edit/:id", (req, res) => {
    if (!req.session.user) {
        return res.render("errors/erro", {error: "403", textError: 'Você não tem permissão para acessar essa página!'});
    }
    post.findAll({where: {'id': req.params.id}}).then(function(post){
        return res.render("edit", {post, navbarLinks: navbarLinksTestes})
    }).catch(function(erro){
        console.log("Erro ao carregar dados do banco: " + erro)
    })
});



//CRIAR TAREFA
app.get("/create", (req, res) => {
    if (!req.session.user) {
        return res.render("errors/erro", {error: "403", textError: 'Você não tem permissão para acessar essa página!'});
    }

    return res.render("create", {title: "Criar Tarefa", navbarLinks: navbarLinksTestes});
});

//CREATE TAREFA
app.post("/cadastrar", function(req, res){
    post.create({
        title: req.body.nomeTarefa,
        due: req.body.dataConclusao,
        description: req.body.descricao,
        class: req.body.nomeMateria,
        status: "Incompleta"
    }).then(function(){
        res.redirect("/")
    }).catch(function(erro){
        res.send("Falha ao cadastrar os dados: " + erro)
    })
})

app.post("/atualizar", function(req, res){
    post.update({
        title: req.body.nomeTarefa,
        due: req.body.dataConclusao,
        description: req.body.descricao,
        class: req.body.nomeMateria
    },{
        where: {
            id: req.body.id
        }
    }).then(function(){
        res.redirect("./todo")
    })
})

//VIEW VISUALIZAR TAREFA
app.get("/view/:id", (req, res) => {
    if (!req.session.user) {
        return res.render("errors/erro", {error: "403", textError: 'Você não tem permissão para acessar essa página!'});
    }
    post.findAll({where: {'id': req.params.id}}).then(function(post){
        return res.render("view", {post, navbarLinks: navbarLinksTestes})
    }).catch(function(erro){
        console.log("Erro ao carregar dados do banco: " + erro)
    })
});



app.use(function (req, res, next) {
    return res.render("errors/erro", {error: "404", textError: 'Página Inexistente!'});
})



//Iniciando Servidor: localhost:8081
app.listen(8081, function(){
    console.log("Servidor Ativo na Porta 8081!");
});