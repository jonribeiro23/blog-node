const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require ('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/', (req, res) => res.render('admin/index'))

router.get('/posts', (req, res) => res.send('<button class="btn btn-danger">página de posts</button>'))

router.get('/categorias', (req, res) => {
  Categoria.find().sort({date: 'desc'})
  .then((categorias) => {
    res.render('admin/categorias', {categorias: categorias})
  })
  .catch((err) => {
    req.flash('error_msg', 'Erro ao carregar categoria: '+err)
    res.redirect('/admin')
  })
})

router.get('/categorias/add', (req, res) => res.render('admin/add-categorias'))

router.post('/categorias/nova', (req, res) => {
  var err = []

  if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
    err.push({text: "Nome inválido"})
  }

  if(req.body.nome.length < 2){
    err.push({text: "O nome é muito curto"})
  }

  if(!req.body.slug || typeof req.body.slug == undefined || req.body.nome == null){
    err.push({text: "Slug inválido"})
  }

  if(err.length > 0){
    console.log(err)
    res.render('admin/add-categorias', {erros: err})
  }else {
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() => {
      req.flash('success_msg', 'Categoria criada com sucesso!')
      res.redirect('/admin/categorias')
    }).catch((err) => {
      req.flash('erro_msg', 'Erro ao registrar categoria. Tente novamente')
      console.log('\n erro: '+err+ '\n')
    })
  }
})

module.exports = router
