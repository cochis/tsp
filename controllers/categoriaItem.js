const { response } = require('express')
const bcrypt = require('bcryptjs')
const CategoriaItem = require('../models/categoriaItem')
const { generarJWT } = require('../helpers/jwt')
//getCategoriaItems CategoriaItem
const getCategoriaItems = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [categoriaItems, total] = await Promise.all([
    CategoriaItem.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    CategoriaItem.countDocuments(),
  ])

  res.json({
    ok: true,
    categoriaItems,
    uid: req.uid,
    total,
  })
}
const getAllCategoriaItems = async (req, res) => {
  const [categoriaItems, total] = await Promise.all([
    CategoriaItem.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    CategoriaItem.countDocuments(),
  ])

  res.json({
    ok: true,
    categoriaItems,
    uid: req.uid,
    total,
  })
}

//crearCategoriaItem CategoriaItem
const crearCategoriaItem = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const categoriaItem = new CategoriaItem({
      ...campos
    })


    await categoriaItem.save()


    res.json({
      ok: true,
      categoriaItem
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarCategoriaItem CategoriaItem
const actualizarCategoriaItem = async (req, res = response) => {
  //Validar token y comporbar si es el scategoriaItem
  const uid = req.params.id
  try {
    const categoriaItemDB = await CategoriaItem.findById(uid)
    if (!categoriaItemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un categoriaItem',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!categoriaItemDB.google) {
      campos.email = email
    } else if (categoriaItemDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El categoriaItem de Google  no se puede actualizar',
      })
    }


    const categoriaItemActualizado = await CategoriaItem.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      categoriaItemActualizado,
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
    const categoriaItemDB = await CategoriaItem.findById(uid)
    if (!categoriaItemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un categoriaItem',
      })
    }
    const campos = req.body
    campos.activated = !categoriaItemDB.activated
    const categoriaItemActualizado = await CategoriaItem.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      categoriaItemActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getCategoriaItemById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const categoriaItemDB = await CategoriaItem.findById(uid)
    if (!categoriaItemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un categoriaItem',
      })
    }
    res.json({
      ok: true,
      categoriaItem: categoriaItemDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getCategoriaItemsByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const categoriaItemDB = await CategoriaItem.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!categoriaItemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      categoriaItems: categoriaItemDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getCategoriaItems,
  crearCategoriaItem,
  actualizarCategoriaItem,
  isActive,
  getCategoriaItemById,
  getAllCategoriaItems,
  getCategoriaItemsByEmail

}
