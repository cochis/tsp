const { response } = require('express')
const bcrypt = require('bcryptjs')
const Evento = require('../models/evento')
const { generarJWT } = require('../helpers/jwt')
//getEventos Evento
const getEventos = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [eventos, total] = await Promise.all([
    Evento.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Evento.countDocuments(),
  ])

  res.json({
    ok: true,
    eventos,
    uid: req.uid,
    total,
  })
}
const getAllEventos = async (req, res) => {
  const [eventos, total] = await Promise.all([
    Evento.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Evento.countDocuments(),
  ])

  res.json({
    ok: true,
    eventos,
    uid: req.uid,
    total,
  })
}

//crearEvento Evento
const crearEvento = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const evento = new Evento({
      ...campos
    })


    await evento.save()


    res.json({
      ok: true,
      evento
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarEvento Evento
const actualizarEvento = async (req, res = response) => {
  //Validar token y comporbar si es el sevento
  const uid = req.params.id
  try {
    const eventoDB = await Evento.findById(uid)
    if (!eventoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un evento',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!eventoDB.google) {
      campos.email = email
    } else if (eventoDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El evento de Google  no se puede actualizar',
      })
    }


    const eventoActualizado = await Evento.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      eventoActualizado,
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
    const eventoDB = await Evento.findById(uid)
    if (!eventoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un evento',
      })
    }
    const campos = req.body
    campos.activated = !eventoDB.activated
    const eventoActualizado = await Evento.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      eventoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getEventoById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const eventoDB = await Evento.findById(uid)
    if (!eventoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un evento',
      })
    }
    res.json({
      ok: true,
      evento: eventoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getEventosByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const eventoDB = await Evento.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!eventoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      eventos: eventoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  isActive,
  getEventoById,
  getAllEventos,
  getEventosByEmail

}
