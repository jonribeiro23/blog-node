const express   = require('express')
const router    = express.Router()
const mongoose  = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')

//Página de cadastro de usuarios
router.get('/registro', (req, res) => {
  res.render('usuarios/registro')
})

//Salvar novo usuário
router.post('/salvar', (req, res) => {
  var erros = []

  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({text: "Nome inválido"})
  }

  if (!req.body.email || typeof req.body.email == undefined || req.body.email == null || !IsEmail(req.body.email)) {
    erros.push({text: "Email inválido"})
  }

  if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
    erros.push({text: "Senha inválida"})
  }

  if(erros.length > 0){
    console.log(err)
    res.render('usuarios/registro', {erros: erros})
  }else{
    const novoUsuario = {
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha
    }

    new Usuario(novoUsuario).save()
    .then(() => {
      req.flash('success_msg', 'Usuário criado com sucesso!')
      res.redirect('/')
    })
    .catch((err) => {
      req.flash('erro_msg', 'Erro ao salvar usuário. Tente novamente')
      res.redirect('/usuarios/registro')
    })
  }
})

function IsEmail(email){
  var padrao = /[a-z0-9]+@[a-z0-9]+\.[a-z0-9]{2,}(\.[a-z0-9]{2,})?/;
  return padrao.test(email);
}

module.exports = router
