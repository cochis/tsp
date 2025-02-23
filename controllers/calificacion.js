const { response } = require('express')
const bcrypt = require('bcryptjs')
const Calificacion = require('../models/calificacion')
const { generarJWT } = require('../helpers/jwt')
//getCalificaciones Calificacion
const getCalificaciones = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [calificaciones, total] = await Promise.all([
    Calificacion.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Calificacion.countDocuments(),
  ])

  res.json({
    ok: true,
    calificaciones,
    uid: req.uid,
    total,
  })
}
const getAllCalificaciones = async (req, res) => {
  const [calificaciones, total] = await Promise.all([
    Calificacion.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Calificacion.countDocuments(),
  ])

  res.json({
    ok: true,
    calificaciones,
    uid: req.uid,
    total,
  })
}

//crearCalificacion Calificacion
const crearCalificacion = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const calificacion = new Calificacion({
      ...campos
    })


    await calificacion.save()


    res.json({
      ok: true,
      calificacion
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarCalificacion Calificacion
const actualizarCalificacion = async (req, res = response) => {
  //Validar token y comporbar si es el scalificacion
  const uid = req.params.id
  try {
    const calificacionDB = await Calificacion.findById(uid)
    if (!calificacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un calificacion',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!calificacionDB.google) {
      campos.email = email
    } else if (calificacionDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El calificacion de Google  no se puede actualizar',
      })
    }


    const calificacionActualizado = await Calificacion.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      calificacionActualizado,
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
    const calificacionDB = await Calificacion.findById(uid)
    if (!calificacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un calificacion',
      })
    }
    const campos = req.body
    campos.activated = !calificacionDB.activated
    const calificacionActualizado = await Calificacion.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      calificacionActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getCalificacionById = async (req, res = response) => {
  const uid = req.params.uid

  try {
    const calificacionDB = await Calificacion.findById(uid)

    if (!calificacionDB) {
      return res.status(200).json({
        ok: false,
        msg: 'No exite un calificacion',
      })
    }
    res.json({
      ok: true,
      calificacion: calificacionDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getCalificacionesByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const calificacionDB = await Calificacion.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!calificacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      calificaciones: calificacionDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}


const getCalificacionByCotizacion = async (req, res = response) => {
  const uid = req.params.uid

  try {
    const calificacionDB = await Calificacion.find({ cotizacion: uid })

    if (!calificacionDB) {
      return res.status(200).json({
        ok: false,
        msg: 'No exite un calificacion',
      })
    }
    res.json({
      ok: true,
      calificacion: calificacionDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}



module.exports = {
  getCalificaciones,
  crearCalificacion,
  actualizarCalificacion,
  isActive,
  getCalificacionById,
  getAllCalificaciones,
  getCalificacionesByEmail,
  getCalificacionByCotizacion

}
