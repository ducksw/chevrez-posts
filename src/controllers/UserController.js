const usr = {}
const User = require('../models/UserModels')
const Post = require('../models/PostsModel')
const Comment = require('../models/CommentModel')

const md5 = require('md5')

usr.index = async (req, res) => {
  try {
    const userCount = await User.countDocuments()
    const user_all = await User.find({}, 'name time').lean()
    const posts = await Post.find().sort({ createdAt: -1 }).populate('user_id', 'name gravatar');
    posts.reverse()
    user_all.reverse()

    for (let post of posts) {
      post.comments = await Comment.find({ post_id: post._id }).lean();
    }

    res.render('index', { userCount, posts, user_all });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la página de inicio');
  }
}

usr.register = async (req, res) => {
  res.render('register')
}

usr.create = async (req, res) => {
  try {
    const trimName = req.body.name.trim()
    req.body.email.trim()
    const existeUser = await User.findOne({ name: trimName })

    if (existeUser) {
      res.render('./partials/existing')
      return
    }

    const newUser = new User(req.body)
    newUser.gravatar = md5(newUser.email)

    console.log("Nuevo usuario", newUser)

    await newUser.save()
    req.session.userName = newUser.name
    req.session.userId = newUser._id

    // res.render('./partials/msg')
    res.redirect(`/perfil/${req.session.userName}`)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al crear un usuario')
  }
}

usr.login = async (req, res) => {
  try {
    const trimName = req.body.name.trim()
    const trimPass = req.body.password.trim()

    const user_con = await User.findOne({ name: trimName })

    if (!user_con || !user_con.comparePassword(trimPass)) {
      res.render('login', { error: 'Nombre de usuario o contraseña incorrectos' })
      return
    }

    req.session.userName = user_con.name
    req.session.userId = user_con._id
    res.redirect(`/perfil/${req.session.userName}`)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al iniciar sesión')
  }
}

usr.profile = async (req, res) => {
  try {
    const userName = req.params.userName.trim()
    const loggedInUser = req.session.userName

    const user = await User.findOne({ name: userName })

    if (user) {
      if (loggedInUser === userName) {
        res.render('perfil', { user, loggedInUser: true })
      } else {
        res.render('perfil', { user, loggedInUser: false })
      }
    } else {
      res.render('./partials/fail')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al cargar el perfil')
  }
}

usr.logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al cerrar sesión');
      } else {
        res.redirect('/index');
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cerrar sesión');
  }
};

module.exports = usr
