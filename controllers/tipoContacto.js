const { response } = require('express')
const bcrypt = require('bcryptjs')
const TipoContacto = require('../models/tipoContacto')
const { generarJWT } = require('../helpers/jwt')
//getTipoContactos TipoContacto
const getTipoContactos = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [tipoContactos, total] = await Promise.all([
    TipoContacto.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    TipoContacto.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoContactos,
    uid: req.uid,
    total,
  })
}
const getAllTipoContactos = async (req, res) => {
  const [tipoContactos, total] = await Promise.all([
    TipoContacto.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    TipoContacto.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoContactos,
    uid: req.uid,
    total,
  })
}

//crearTipoContacto TipoContacto
const crearTipoContacto = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const tipoContacto = new TipoContacto({
      ...campos
    })


    await tipoContacto.save()


    res.json({
      ok: true,
      tipoContacto
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarTipoContacto TipoContacto
const actualizarTipoContacto = async (req, res = response) => {
  //Validar token y comporbar si es el stipoContacto
  const uid = req.params.id
  try {
    const tipoContactoDB = await TipoContacto.findById(uid)
    if (!tipoContactoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoContacto',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipoContactoDB.google) {
      campos.email = email
    } else if (tipoContactoDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipoContacto de Google  no se puede actualizar',
      })
    }


    const tipoContactoActualizado = await TipoContacto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoContactoActualizado,
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
    const tipoContactoDB = await TipoContacto.findById(uid)
    if (!tipoContactoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoContacto',
      })
    }
    const campos = req.body
    campos.activated = !tipoContactoDB.activated
    const tipoContactoActualizado = await TipoContacto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoContactoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getTipoContactoById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoContactoDB = await TipoContacto.findById(uid)
    if (!tipoContactoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoContacto',
      })
    }
    res.json({
      ok: true,
      tipoContacto: tipoContactoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getTipoContactosByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const tipoContactoDB = await TipoContacto.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!tipoContactoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      tipoContactos: tipoContactoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getTipoContactos,
  crearTipoContacto,
  actualizarTipoContacto,
  isActive,
  getTipoContactoById,
  getAllTipoContactos,
  getTipoContactosByEmail

}
