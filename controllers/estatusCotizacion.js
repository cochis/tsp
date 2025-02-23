const { response } = require('express')
const bcrypt = require('bcryptjs')
const EstatusCotizacion = require('../models/estatusCotizacion')
const { generarJWT } = require('../helpers/jwt')
//getEstatusCotizaciones EstatusCotizacion
const getEstatusCotizaciones = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [estatusCotizaciones, total] = await Promise.all([
    EstatusCotizacion.find({})
      .sort({ step: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    EstatusCotizacion.countDocuments(),
  ])

  res.json({
    ok: true,
    estatusCotizaciones,
    uid: req.uid,
    total,
  })
}
const getAllEstatusCotizaciones = async (req, res) => {
  const [estatusCotizaciones, total] = await Promise.all([
    EstatusCotizacion.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ step: 1 }),
    EstatusCotizacion.countDocuments(),
  ])

  res.json({
    ok: true,
    estatusCotizaciones,
    uid: req.uid,
    total,
  })
}

//crearEstatusCotizacion EstatusCotizacion
const crearEstatusCotizacion = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const estatusCotizacion = new EstatusCotizacion({
      ...campos
    })


    await estatusCotizacion.save()


    res.json({
      ok: true,
      estatusCotizacion
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarEstatusCotizacion EstatusCotizacion
const actualizarEstatusCotizacion = async (req, res = response) => {
  //Validar token y comporbar si es el sestatusCotizacion
  const uid = req.params.id
  try {
    const estatusCotizacionDB = await EstatusCotizacion.findById(uid)
    if (!estatusCotizacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un estatusCotizacion',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!estatusCotizacionDB.google) {
      campos.email = email
    } else if (estatusCotizacionDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El estatusCotizacion de Google  no se puede actualizar',
      })
    }


    const estatusCotizacionActualizado = await EstatusCotizacion.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      estatusCotizacionActualizado,
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
    const estatusCotizacionDB = await EstatusCotizacion.findById(uid)
    if (!estatusCotizacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un estatusCotizacion',
      })
    }
    const campos = req.body
    campos.activated = !estatusCotizacionDB.activated
    const estatusCotizacionActualizado = await EstatusCotizacion.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      estatusCotizacionActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getEstatusCotizacionById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const estatusCotizacionDB = await EstatusCotizacion.findById(uid)
    if (!estatusCotizacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un estatusCotizacion',
      })
    }
    res.json({
      ok: true,
      estatusCotizacion: estatusCotizacionDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getEstatusCotizacionesByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const estatusCotizacionDB = await EstatusCotizacion.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!estatusCotizacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      estatusCotizaciones: estatusCotizacionDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getEstatusCotizacionesByStep = async (req, res = response) => {
  const step = req.params.step



  try {
    const estatusCotizacionDB = await EstatusCotizacion.find({ step: step })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!estatusCotizacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      estatusCotizaciones: estatusCotizacionDB[0],
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getEstatusCotizaciones,
  crearEstatusCotizacion,
  actualizarEstatusCotizacion,
  isActive,
  getEstatusCotizacionById,
  getAllEstatusCotizaciones,
  getEstatusCotizacionesByEmail,
  getEstatusCotizacionesByStep

}
