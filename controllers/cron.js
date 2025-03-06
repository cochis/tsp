const { response } = require('express')
const bcrypt = require('bcryptjs')
const Cron = require('../models/cron')
const { generarJWT } = require('../helpers/jwt')
//getCrons Cron
const getCrons = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [crons, total] = await Promise.all([
    Cron.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Cron.countDocuments(),
  ])

  res.json({
    ok: true,
    crons,
    uid: req.uid,
    total,
  })
}
const getAllCrons = async (req, res) => {
  const [crons, total] = await Promise.all([
    Cron.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Cron.countDocuments(),
  ])

  res.json({
    ok: true,
    crons,
    uid: req.uid,
    total,
  })
}

//crearCron Cron
const crearCron = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const cron = new Cron({
      ...campos
    })


    await cron.save()


    res.json({
      ok: true,
      cron
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarCron Cron
const actualizarCron = async (req, res = response) => {
  //Validar token y comporbar si es el scron
  const uid = req.params.id
  try {
    const cronDB = await Cron.findById(uid)
    if (!cronDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un cron',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!cronDB.google) {
      campos.email = email
    } else if (cronDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El cron de Google  no se puede actualizar',
      })
    }


    const cronActualizado = await Cron.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      cronActualizado,
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
    const cronDB = await Cron.findById(uid)
    if (!cronDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un cron',
      })
    }
    const campos = req.body
    campos.activated = !cronDB.activated
    const cronActualizado = await Cron.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      cronActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getCronById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const cronDB = await Cron.findById(uid)
    if (!cronDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un cron',
      })
    }
    res.json({
      ok: true,
      cron: cronDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getCronsByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const cronDB = await Cron.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!cronDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      crons: cronDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getCrons,
  crearCron,
  actualizarCron,
  isActive,
  getCronById,
  getAllCrons,
  getCronsByEmail

}
