const { response } = require('express')
const bcrypt = require('bcryptjs')
const Post = require('../models/post')
const { generarJWT } = require('../helpers/jwt')
//getPosts Post
const getPosts = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [posts, total] = await Promise.all([
    Post.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Post.countDocuments(),
  ])

  res.json({
    ok: true,
    posts,
    uid: req.uid,
    total,
  })
}
const getAllPosts = async (req, res) => {
  const [posts, total] = await Promise.all([
    Post.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Post.countDocuments(),
  ])

  res.json({
    ok: true,
    posts,
    uid: req.uid,
    total,
  })
}

//crearPost Post
const crearPost = async (req, res = response) => {

  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const post = new Post({
      ...campos
    })


    await post.save()


    res.json({
      ok: true,
      post
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarPost Post
const actualizarPost = async (req, res = response) => {
  //Validar token y comporbar si es el spost
  const uid = req.params.id
  try {
    const postDB = await Post.findById(uid)
    if (!postDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un post',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!postDB.google) {
      campos.email = email
    } else if (postDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El post de Google  no se puede actualizar',
      })
    }


    const postActualizado = await Post.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      postActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}


const isActive = async (req, res = response) => {
  const uid = req.params.id
  try {
    const postDB = await Post.findById(uid)
    if (!postDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un post',
      })
    }
    const campos = req.body
    campos.activated = !postDB.activated
    const postActualizado = await Post.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      postActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getPostById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const postDB = await Post.findById(uid)
    if (!postDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un post',
      })
    }
    res.json({
      ok: true,
      post: postDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getPostsByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const postDB = await Post.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!postDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      posts: postDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getPosts,
  crearPost,
  actualizarPost,
  isActive,
  getPostById,
  getAllPosts,
  getPostsByEmail

}
