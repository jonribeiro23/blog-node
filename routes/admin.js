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

//Pagina que adiciona categoria
router.get('/categorias/add', (req, res) => res.render('admin/add-categorias'))

//Salva categoria
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

//Pagina de edição de categoria
router.get('/categorias/edit/:id', (req, res) => {
  Categoria.findById(req.params.id)
  .then((cate) => {
    res.render('admin/edit-categorias', {cate: cate})
  })
  .catch((err) => {
    req.flash('error_msg','Categoria não encotrada!')
    res.redirect('/admin/categorias')
  })
})

//Salva a edição de categoria
router.post('/categorias/edit/salvar', (req, res) => {
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
    res.render('admin/edit-categorias', {erros: err})
  }else {
    // let dados = Categoria.findById(req.body._id)
    // console.log(dados.schema.obj.nome)
    Categoria.updateOne({_id: req.body.id}, {
      $set: {
        nome: req.body.nome,
        slug: req.body.slug
      }
    }).then(() =>{
      req.flash('success_msg', 'Categoria atualizada com sucesso!')
      res.redirect('/admin/categorias')
    }).catch((err) => {
      req.flash('error_msg', 'Erro ao atualizar!'+err)
      res.redirect('/admin/categorias')
    })
  }
})

//Página que deleta uma categoria
router.get('/categorias/delete/:id', (req, res) => {
  Categoria.findById(req.params.id)
  .then((cate) => {
    res.render('admin/delete-categorias', {cate: cate})
  })
  .catch((err) => {
    req.flash('error_msg','Categoria não encotrada!')
    res.redirect('/admin/categorias')
  })
})

//Deleta uma categoria
router.get('/categorias/deletar/:id', (req, res) => {
  Categoria.deleteOne({_id: req.params.id}, (err) => {
    if (err) {
      req.flash('error_msg','Erro ao deletar'+err)
      res.redirect('/admin/categorias')
    }
  }).then(() => {
    req.flash('success_msg','Categoria deletada com sucesso')
    res.redirect('/admin/categorias')
  })
})

module.exports = router
