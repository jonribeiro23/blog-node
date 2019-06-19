const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require ('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')

//==================== CATEGORIAS ====================
router.get('/', (req, res) => res.render('admin/index'))

// router.get('/posts', (req, res) => res.send('<button class="btn btn-danger">página de posts</button>'))

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

//==================== POSTAGENS ====================

//Lista postagens
router.get('/postagens', (req, res) => {
  // Postagem.find().sort({data: 'desc'})
  // .then((postagens) => {
  //   res.render('admin/postagens/postagens', {post: postagens})
  // })
  // .catch((err) => {
  //   req.flash('error_msg', 'Erro ao listar postagens!')
  //   res.render('admin/postagens/postagens')
  // })

  //Utilizando o a função Populate
  Postagem.find().populate('categoria').sort({data: 'desc'})
  .then((postagens) => {
    res.render('admin/postagens/postagens', {post: postagens})
  })
  .catch((err) => {
    req.flash('error_msg', 'Erro ao listar postagens!')
    res.redirect('/admin')
  })
})

//Adiciona postagens
router.get('/postagens/add', (req, res) => {
  Categoria.find()
  .then((categorias) => {
      res.render('admin/postagens/add-postagem', {cate: categorias})
  })
  .catch((err) => {
    req.flash('error_msg', 'Erro ao carregar o formulário'+err)
    res.redirect('/admin')
  })

})

//Salva postagens
router.post('/postagens/salvar', (req, res) => {
  let erros = []
  if (req.body.categoria == 0) {
    erros.push({text: 'Você precisa registrar uma categoria antes de postar'})
  }
  if (erros.length > 0) {
    res.render('admin/postagens/add-postagem')
  }else{
    const novaPostagem = {
      titulo: req.body.titulo,
      slug: req.body.slug,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria
    }

    new Postagem(novaPostagem).save()
    .then(() => {
      req.flash('success_msg', 'Postagem criada com sucesso')
      res.redirect('/admin/postagens')
    })
    .catch((err) => {
      req.flash('error_msg', 'Falha ao criar postagem. Tente mais tarde')
      res.redirect('/admin/postagens')
    })
  }
})

//pagina de editar Postagem
router.get('/postagens/editar/:id', (req, res) => {
  let cate = []
  Categoria.find()
  .then((dados) => cate = dados)

  Postagem.findById(req.params.id)
  .then((post) => {
    res.render('admin/postagens/edit-postagem', {post: post, cate: cate})
  })
  .catch((err) => {
    req.flash('error_msg', 'Postagem não encontrada')
    res.redirect('admin/postagens')
  })
})

//Salvar edição
router.post('/postagens/editar/salvar/:id', (req, res) => {
  let erros = []
  if (req.body.categoria == 0) {
    erros.push({text: 'Você precisa registrar uma categoria antes de postar'})
  }
  if (erros.length > 0) {
    res.render('admin/postagens/add-postagem')
  }else{
    Postagem.updateOne({_id: req.params.id}, {
      titulo: req.body.titulo,
      slug: req.body.slug,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria
    })
    .then(() => {
      req.flash('success_msg', 'Postagem atualizada com sucesso!')
      res.redirect('/admin/postagens')
    })
    .catch((err) => {
      req.flash('success_msg', 'Postagem atualizada com sucesso!')
      res.redirect('/admin/postagens')
    })
  }
})

//Pagina de deletar Postagem
router.get('/postagens/delete/:id', (req, res) => {
  Postagem.findById(req.params.id)
  .then((post) => {
    console.log(post)
    res.render('admin/postagens/delete-postagem', {post: post})
  })
  .catch((err) => {
    req.flash('error_msg', 'Postagem não encontrada')
    res.redirect('admin/postagens')
  })
})

//Deleta Postagem
router.get('/postagens/deletar/:id', (req, res) => {
  Postagem.deleteOne({_id: req.params.id}, (err) => {
    if (err) {
      req.flash('error_msg','Erro ao deletar'+err)
      res.redirect('/admin/categorias')
    }
  }).then(() => {
    req.flash('success_msg', 'Postagem deletada com sucesso')
    res.redirect('/admin/postagens')
  })
})


module.exports = router
