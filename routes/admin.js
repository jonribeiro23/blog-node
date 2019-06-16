const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require ('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/', (req, res) => res.render('admin/index'))

router.get('/posts', (req, res) => res.send('<button class="btn btn-danger">página de posts</button>'))

router.get('/categorias', (req, res) => res.render('admin/categorias'))

router.get('/categorias/add', (req, res) => res.render('admin/add-categorias'))

router.post('/categorias/nova', (req, res) => {
  const novaCategoria = {
    nome: req.body.nome,
    slug: req.body.slug
  }

  new Categoria(novaCategoria).save().then(() => {
    console.log('\n Salvo com sucesso \n')
  }).catch((err) => {
    console.log('\n erro: '+err+ '\n')
  })
})

module.exports = router
