const { response } = require('express')
const bcrypt = require('bcryptjs')
const ImgItem = require('../models/imgItem')
const { generarJWT } = require('../helpers/jwt')
//getImgItems ImgItem
const getImgItems = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [imgItems, total] = await Promise.all([
    ImgItem.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    ImgItem.countDocuments(),
  ])

  res.json({
    ok: true,
    imgItems,
    uid: req.uid,
    total,
  })
}
const getAllImgItems = async (req, res) => {
  const [imgItems, total] = await Promise.all([
    ImgItem.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    ImgItem.countDocuments(),
  ])

  res.json({
    ok: true,
    imgItems,
    uid: req.uid,
    total,
  })
}

//crearImgItem ImgItem
const crearImgItem = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const imgItem = new ImgItem({
      ...campos
    })


    await imgItem.save()


    res.json({
      ok: true,
      imgItem
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarImgItem ImgItem
const actualizarImgItem = async (req, res = response) => {
  //Validar token y comporbar si es el simgItem
  const uid = req.params.id
  try {
    const imgItemDB = await ImgItem.findById(uid)
    if (!imgItemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un imgItem',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!imgItemDB.google) {
      campos.email = email
    } else if (imgItemDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El imgItem de Google  no se puede actualizar',
      })
    }


    const imgItemActualizado = await ImgItem.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      imgItemActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

existByName = async (req, res = response) => {
  const name = req.params.name

  try {
    const imgItemDB = await ImgItem.find(
      { name: name })
    if (!imgItemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un imgItem',
      })
    }
    res.json({
      ok: true,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}
existByImg = async (req, res = response) => {
  const img = req.params.img

  try {
    const imgItemDB = await ImgItem.find(
      { img: img })
    if (!imgItemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un imgItem',
      })
    }
    res.json({
      ok: true,
      imgItemDB
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}
const isActive = async (req, res = response) => {
  const uid = req.params.id
  try {
    const imgItemDB = await ImgItem.findById(uid)
    if (!imgItemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un imgItem',
      })
    }
    const campos = req.body
    campos.activated = !imgItemDB.activated
    const imgItemActualizado = await ImgItem.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      imgItemActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getImgItemById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const imgItemDB = await ImgItem.findById(uid)
    if (!imgItemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un imgItem',
      })
    }
    res.json({
      ok: true,
      imgItem: imgItemDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getImgItemsByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const imgItemDB = await ImgItem.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!imgItemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      imgItems: imgItemDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
existByItem = async (req, res = response) => {
  const item = req.params.item

  try {
    const imgItemDB = await ImgItem.find(
      { item: item })
    if (!imgItemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un imgItem',
      })
    }
    res.json({
      ok: true,
      'imgItems': imgItemDB
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

module.exports = {
  getImgItems,
  crearImgItem,
  actualizarImgItem,
  isActive,
  getImgItemById,
  getAllImgItems,
  getImgItemsByEmail,
  existByImg,
  existByName,
  existByItem

}
