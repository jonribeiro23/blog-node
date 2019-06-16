// CARREGANDO MÓDULOS
const express     = require('express')
const handlebars = require('express-handlebars')
const bodyParser  = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose    = require('mongoose')

// CONFIGURAÇÕES
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

//ROTAS
  app.get('/', (req, res) => res.render('home'))
  app.use('/admin', admin)

//OUTROS
const PORT = 8081
app.listen(PORT, () => {
  console.log('\n\n Server Running \n\n')
})
