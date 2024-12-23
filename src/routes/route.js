const express = require('express')
const router = express.Router()

const home = require('../controllers/HomeController')
const staff = require('../controllers/AdminController')
const publi = require('../controllers/PostController')
const user = require('../controllers/UserController')
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/admin'); 

module.exports = app => {
  router.get('/', home.index)

  // admin
  router.get('/index/adminchevrezadminchevrez', staff.index)
  router.post('/index/adminchevrezadminchevrez', staff.login)
  router.get('/index/team', staff.views)

  // user
  router.get('/index', user.index)
  router.get('/index/register', user.register)
  router.post('/index/register', user.create)
  router.get('/perfil/:userName', user.profile)
  router.post('/logout', user.logout);
  router.get('/index/login', (req, res) => {
    res.render('login')
  })
  router.post('/index/login', user.login)

  // posts
  router.get('/index', publi.views)
  router.get('/index/posts', publi.index)
  router.post('/index', isAdmin, publi.create)
  router.get('/posts/:postTitle', publi.public)
  router.post('/posts/:post_id/comment', authMiddleware, publi.comment)
  router.delete('/posts/:post_id', publi.delete)

  app.use(router)
}
