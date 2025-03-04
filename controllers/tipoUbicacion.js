const { response } = require('express')
const bcrypt = require('bcryptjs')
const TipoUbicacion = require('../models/tipoUbicacion')
const { generarJWT } = require('../helpers/jwt')
//getTipoUbicaciones TipoUbicacion
const getTipoUbicaciones = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [tipoUbicaciones, total] = await Promise.all([
    TipoUbicacion.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')

      .skip(desde)
      .limit(cant),
    TipoUbicacion.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoUbicaciones,
    uid: req.uid,
    total,
  })
}
const getAllTipoUbicaciones = async (req, res) => {
  const [tipoUbicaciones, total] = await Promise.all([
    TipoUbicacion.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')

      .sort({ nombre: 1 }),
    TipoUbicacion.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoUbicaciones,
    uid: req.uid,
    total,
  })
}

//crearTipoUbicacion TipoUbicacion
const crearTipoUbicacion = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const tipoUbicacion = new TipoUbicacion({
      ...campos
    })


    await tipoUbicacion.save()


    res.json({
      ok: true,
      tipoUbicacion
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarTipoUbicacion TipoUbicacion
const actualizarTipoUbicacion = async (req, res = response) => {
  //Validar token y comporbar si es el stipoUbicacion
  const uid = req.params.id
  try {
    const tipoUbicacionDB = await TipoUbicacion.findById(uid)
    if (!tipoUbicacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoUbicacion',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipoUbicacionDB.google) {
      campos.email = email
    } else if (tipoUbicacionDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipoUbicacion de Google  no se puede actualizar',
      })
    }


    const tipoUbicacionActualizado = await TipoUbicacion.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoUbicacionActualizado,
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
    const tipoUbicacionDB = await TipoUbicacion.findById(uid)
    if (!tipoUbicacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoUbicacion',
      })
    }
    const campos = req.body
    campos.activated = !tipoUbicacionDB.activated
    const tipoUbicacionActualizado = await TipoUbicacion.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoUbicacionActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getTipoUbicacionById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoUbicacionDB = await TipoUbicacion.findById(uid)
    if (!tipoUbicacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoUbicacion',
      })
    }
    res.json({
      ok: true,
      tipoUbicacion: tipoUbicacionDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getTipoUbicacionesByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const tipoUbicacionDB = await TipoUbicacion.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')

      .populate('roles')
    if (!tipoUbicacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      tipoUbicaciones: tipoUbicacionDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getTipoUbicaciones,
  crearTipoUbicacion,
  actualizarTipoUbicacion,
  isActive,
  getTipoUbicacionById,
  getAllTipoUbicaciones,
  getTipoUbicacionesByEmail

}
