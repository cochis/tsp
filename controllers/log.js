const { response } = require('express')
const bcrypt = require('bcryptjs')
const Log = require('../models/log')
const { generarJWT } = require('../helpers/jwt')
//getLogs Log
const getLogs = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [tipostocks, total] = await Promise.all([
    Log.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Log.countDocuments(),
  ])

  res.json({
    ok: true,
    tipostocks,
    uid: req.uid,
    total,
  })
}
const getMyLogs = async (req, res) => {
  const uid = req.params.uid
  const [logs, total] = await Promise.all([
    Log.find({ usuarioCreated: uid })
      .populate('tipoLog')
      .populate('estado')

      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Log.countDocuments(),
  ])


  res.json({
    ok: true,
    logs,
    uid: req.uid,
    total,
  })
}
const getAllLogs = async (req, res) => {
  const [logs, total] = await Promise.all([
    Log.find({})

      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Log.countDocuments(),
  ])


  res.json({
    ok: true,
    logs,
    uid: req.uid,
    total,
  })
}

//crearLog Log
const crearLog = async (req, res = response) => {
  const { email, password } = req.body

  const uid = req.uid

  const campos = {
    ...req.body

  }

  try {


    const log = new Log({
      ...campos
    })



    await log.save()


    res.json({
      ok: true,
      log
    })
  } catch (error) {
    console.error('error', error)

    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error: error
    })
  }
}

//actualizarLog Log
const actualizarLog = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await Log.findById(uid)

    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }



    const tipostockActualizado = await Log.findByIdAndUpdate(uid, req.body, {
      new: true,
    })
    res.json({
      ok: true,
      tipostockActualizado,
    })
  } catch (error) {

    res.status(500).json({
      ok: false,
      msg: 'Error inesperado', error: error,
    })
  }
}
const registrarAsistencia = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await Log.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const { ...campos } = req.body

    const tipostockActualizado = await Log.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipostockActualizado,
    })
  } catch (error) {

    res.status(500).json({
      ok: false,
      msg: 'Error inesperado', error: error,
      error: error
    })
  }
}
const confirmaLog = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await Log.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipostockDB.google) {
      campos.email = email
    } else if (tipostockDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipostock de Google  no se puede actualizar',
      })
    }


    const tipostockActualizado = await Log.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipostockActualizado,
    })
  } catch (error) {

    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
      error: error,
    })
  }
}


const isActive = async (req, res = response) => {
  const uid = req.params.id
  try {
    const tipostockDB = await Log.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const campos = req.body
    campos.activated = !tipostockDB.activated
    const tipostockActualizado = await Log.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipostockActualizado,
    })
  } catch (error) {

    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error: error
    })
  }
}

const getLogById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipostockDB = await Log.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    res.json({
      ok: true,
      log: tipostockDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado', error: error,
    })
  }
}




module.exports = {
  getLogs,
  crearLog,
  actualizarLog,
  isActive,
  getLogById,
  getAllLogs,
  getMyLogs

}
