const express = require('express')
const router = express.Router()

router.get('/', (req, res) => res.render('admin/index'))

router.get('/posts', (req, res) => res.send('<button class="btn btn-danger">página de posts</button>'))

router.get('/categorias', (req, res) => res.render('admin/categorias'))

router.get('/categorias/add', (req, res) => res.render('admin/add-categorias'))

module.exports = router
