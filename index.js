// CARREGANDO MÓDULOS
const express     = require('express')
const handlebars  = require('handlebars')
const bodyParser  = require('body-parser')
const app = express()
// const mongoose    = require('mongoose')

// CONFIGURAÇÕES
  //bodyParser
  app.use(bodyParser.urlencoded({extend: true}))
  app.use(bodyParser.json())

  //handlebars
  app.engine('handlebars', handlebars({defaultLayout: 'main'}))
  app.set('view engine', 'handlebars')

  //mongoose
    //em breve

//ROTAS

//OUTROS
const PORT = 8081
app.listen(PORT, () => {
  console.log('\n\n Server Running \n\n')
})
