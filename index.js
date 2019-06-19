// CARREGANDO MÓDULOS
const express     = require('express')
const handlebars  = require('express-handlebars')
const bodyParser  = require('body-parser')
const app         = express()
const admin       = require('./routes/admin')
const path        = require('path')
const mongoose    = require('mongoose')
const session     = require('express-session')
const flash       = require('connect-flash')
require('./models/Postagem')
require('./models/Categoria')
const Postagem    = mongoose.model('postagens')
const Categoria   = mongoose.model('categorias')

// CONFIGURAÇÕES

  //session
    app.set('trust proxy', 1)
    app.use(session({
      secret: 'savior',
      resave: false,
      saveUninitialized: true
    }))

    app.use(flash())

    //middleware
    app.use((req, res, next) => {
      res.locals.success_msg = req.flash('success_msg')
      res.locals.error_msg = req.flash('error_msg')
      next()
    })

  //bodyParser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

  //handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

  //mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/blogapp', {useNewUrlParser: true})
    .then(() => console.log('\n\n Successfull connection'))
    .catch((err) => console.log('\n\n Connection failure: '+err+' \n\n'))

  //public
    app.use(express.static(path.join(__dirname, 'public')))
    //middleware -> tudo que houver app.use é um middleware
    // app.use((req, res, next) => {
    //   console.log('\n eu sou um middleware')
    //   next()
    // })

//ROTAS
//Home
  app.get('/', (req, res) => {
    Postagem.find().populate('categoria').sort({data: 'desc'})
    .then((post) => res.render('index', {post: post}))
    .catch((err) => {
      req.flash('error_msg', 'Erro ao carregar categoria: '+err)
      res.redirect('/404')
    })
  })

//Leia mais
  app.get('/leiamais/:slug', (req, res) => {
    Postagem.findOne({slug: req.params.slug}).then((post) => {
      if (post) {
          res.render('leia-mais', {post: post})
      }else{
        req.flash('error_msg', 'Postagem não encontrada :´(')
        res.redirect('/404')
      }
    })
    .catch((err) => {
      req.flash('error_msg', 'Postagem não encontrada: '+err)
      res.redirect('/404')
    })
  })



//404
  app.get('/404', (req, res) => res.render('erro-404'))

//Admin
  app.use('/admin', admin)

//OUTROS
const PORT = 8081
app.listen(PORT, () => {
  console.log('\n\n Server Running \n\n')
})
