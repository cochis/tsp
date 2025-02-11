const { response } = require('express')
const bcrypt = require('bcryptjs')
const TipoItem = require('../models/tipoItem')
const { generarJWT } = require('../helpers/jwt')
//getTipoItems TipoItem
const getTipoItems = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [tipoItems, total] = await Promise.all([
    TipoItem.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    TipoItem.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoItems,
    uid: req.uid,
    total,
  })
}
const getAllTipoItems = async (req, res) => {
  const [tipoItems, total] = await Promise.all([
    TipoItem.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    TipoItem.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoItems,
    uid: req.uid,
    total,
  })
}

//crearTipoItem TipoItem
const crearTipoItem = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const tipoItem = new TipoItem({
      ...campos
    })


    await tipoItem.save()


    res.json({
      ok: true,
      tipoItem
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarTipoItem TipoItem
const actualizarTipoItem = async (req, res = response) => {
  //Validar token y comporbar si es el stipoItem
  const uid = req.params.id
  try {
    const tipoItemDB = await TipoItem.findById(uid)
    if (!tipoItemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoItem',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipoItemDB.google) {
      campos.email = email
    } else if (tipoItemDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipoItem de Google  no se puede actualizar',
      })
    }


    const tipoItemActualizado = await TipoItem.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoItemActualizado,
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
    const tipoItemDB = await TipoItem.findById(uid)
    if (!tipoItemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoItem',
      })
    }
    const campos = req.body
    campos.activated = !tipoItemDB.activated
    const tipoItemActualizado = await TipoItem.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoItemActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getTipoItemById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoItemDB = await TipoItem.findById(uid)
    if (!tipoItemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoItem',
      })
    }
    res.json({
      ok: true,
      tipoItem: tipoItemDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getTipoItemsByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const tipoItemDB = await TipoItem.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!tipoItemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      tipoItems: tipoItemDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getTipoItems,
  crearTipoItem,
  actualizarTipoItem,
  isActive,
  getTipoItemById,
  getAllTipoItems,
  getTipoItemsByEmail

}
