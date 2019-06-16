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

// CONFIGURAÇÕES

  //session
    app.use(() => {
      secret: 'cursodenode',
      resave: 'true',
      seveUnitialized: true
    })

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
    mongoose.connect('mongodb://localhost/blogapp')
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
  app.get('/', (req, res) => res.render('home'))
  app.use('/admin', admin)

//OUTROS
const PORT = 8081
app.listen(PORT, () => {
  console.log('\n\n Server Running \n\n')
})
