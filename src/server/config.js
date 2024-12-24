const path = require('path')
const { create } = require('express-handlebars')
const morgan = require('morgan')
const multer = require('multer')
const express = require('express')
const errorHandler = require('errorhandler')
const session = require('express-session');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');


const routes = require('../routes/route')

module.exports = app => {
  app.set('port', 3000)
  app.set('views', path.join(__dirname, '../views'))

  app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    // cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
    // store: MongoStore.create({ mongoUrl: 'mongodb://localhost/testing' })
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
  }));

  app.use(methodOverride('_method'));


  app.use((req, res, next) => {
    res.locals.userName = req.session.userName;
    res.locals.userId = req.session.userId;
    
    res.locals.adminName = req.session.adminName;
    res.locals.userId = req.session.adminId;
    next();
  });

  const hbs = create({
    defaultLayout: 'main',
    partialsDir: path.join(app.get('views'), 'partials'),
    layoutsDir: path.join(app.get('views'), 'layouts'),
    extname: '.hbs',
    helpers: require('./helpers'),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true 
    }
  });

  app.engine('.hbs', hbs.engine)
  app.set('view engine', '.hbs')

  app.use(morgan('dev'))
  app.use(multer({dest: path.join(__dirname, '../public/upload/temp')}).single('image'))

  app.use(express.urlencoded({extended: true}))
  app.use(express.json())

  // routes
  routes(app)

  app.use('/public', express.static(path.join(__dirname, '../public')))


  if ('development' == app.get('env')) {
    app.use(errorHandler)
  }

  return app
}
