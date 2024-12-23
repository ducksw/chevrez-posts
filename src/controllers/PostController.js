const pub = {}

const Post = require('../models/PostsModel')
const Comment = require('../models/CommentModel')
const { randomNumber } = require('../helpers/random')
const path = require('path')
const fs = require('fs-extra')

pub.index = async(req, res) => {
  res.render('create_posts')
}

pub.create = async(req, res) => {
  try {
    let urlImage;
    let ext;
    let target;
    let imagePath;

    if (req.file) { 
      urlImage = randomNumber();
      const images = await Post.find({ filename: urlImage });

      if (images.length > 0) {
        urlImage = randomNumber();
      }

      imagePath = req.file.path;
      ext = path.extname(req.file.originalname).toLowerCase();
      target = path.resolve(`src/public/upload/${urlImage}${ext}`);

      if (ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".gif") {
        await fs.rename(imagePath, target);
      } else {
        await fs.unlink(imagePath);
        return res.send('Solo imagenes, .png, .jpg, .jpeg, .gif');
      }
    }

    const newPost = new Post({
      ...req.body,
      user_id: req.session.userId,
      filename: req.file ? `${urlImage}${ext}` : '',
    });

    // console.log(newPost);

    await newPost.save();
    req.session.postTitle = newPost._id;

    res.redirect('/index');
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al crear un POST')
  }
}

pub.views = async(req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('user_id', 'name gravatar')
    posts.reverse()

    for (let post of posts) {
      post.comments = await Comment.find({ post_id: post._id }).lean()
    }

    res.render('index', { posts, session: req.session })
  } catch (error) {
    console.error(error)
    res.status(500).send('FAIL')
  }
}

pub.comment = async (req, res) => {
  const postId = req.params.post_id
  const post = await Post.findById(postId)
  // const user = await User.findById()

  if (post) {
    const newComment = new Comment({
      ...req.body,
      post_id: post._id,
      user_id: req.session.userId,
    })
    //const newComment = new Comment(req.body)
   newComment.post_id = post
    await newComment.save()
    res.redirect('/posts/' + post._id)
  }
}

pub.public = async(req, res) => {
  const post_title = req.params.postTitle
  const publi = await Post.findById({ _id: post_title }).populate('user_id', 'name gravatar');
  const comments = await Comment.find({post_id: post_title}).populate('user_id', 'name').sort({ createdAt: -1 });
  comments.reverse()

  if (publi) {
    res.render('posts', { publi, comments })
  } else {
    //res.render('./partials/fail')
    res.send('No hay post')
  }
}

pub.delete = async (req, res) => {
  try {
    const postId = req.params.post_id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send('Post not found');
    }

    if (post.filename) {
      const imagePath = path.resolve(`src/public/upload/${post.filename}`);
      await fs.unlink(imagePath);
    }

    await Post.findByIdAndDelete(postId);

    await Comment.deleteMany({ post_id: postId });

    res.redirect('/index');
    console.log(postId)
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el post');
  }
}

module.exports = pub