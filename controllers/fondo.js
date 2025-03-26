const { response } = require('express')
const bcrypt = require('bcryptjs')
const Fondo = require('../models/fondo')
const { generarJWT } = require('../helpers/jwt')
//getFondos Fondo
const getFondos = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [fondos, total] = await Promise.all([
    Fondo.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Fondo.countDocuments(),
  ])

  res.json({
    ok: true,
    fondos,
    uid: req.uid,
    total,
  })
}
const getAllFondos = async (req, res) => {
  const [fondos, total] = await Promise.all([
    Fondo.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Fondo.countDocuments(),
  ])

  res.json({
    ok: true,
    fondos,
    uid: req.uid,
    total,
  })
}

//crearFondo Fondo
const crearFondo = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const fondo = new Fondo({
      ...campos
    })


    await fondo.save()


    res.json({
      ok: true,
      fondo
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarFondo Fondo
const actualizarFondo = async (req, res = response) => {
  //Validar token y comporbar si es el sfondo
  const uid = req.params.id
  try {
    const fondoDB = await Fondo.findById(uid)
    if (!fondoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un fondo',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!fondoDB.google) {
      campos.email = email
    } else if (fondoDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El fondo de Google  no se puede actualizar',
      })
    }


    const fondoActualizado = await Fondo.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      fondoActualizado,
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
    const fondoDB = await Fondo.findById(uid)
    if (!fondoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un fondo',
      })
    }
    const campos = req.body
    campos.activated = !fondoDB.activated
    const fondoActualizado = await Fondo.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      fondoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getFondoById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const fondoDB = await Fondo.findById(uid)
    if (!fondoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un fondo',
      })
    }
    res.json({
      ok: true,
      fondo: fondoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getFondosByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const fondoDB = await Fondo.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!fondoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      fondos: fondoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getFondos,
  crearFondo,
  actualizarFondo,
  isActive,
  getFondoById,
  getAllFondos,
  getFondosByEmail

}
