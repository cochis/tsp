const { response } = require('express')
const bcrypt = require('bcryptjs')
const Invitacion = require('../models/invitacion')
const { generarJWT } = require('../helpers/jwt')
//getInvitacions Invitacion
const getInvitacions = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [invitacions, total] = await Promise.all([
      Invitacion.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      Invitacion.countDocuments(),
    ])

    res.json({
      ok: true,
      invitacions,
      uid: req.uid,
      total,
    })
  } catch (error) {
    console.error('error::: ', error);
    res.json({
      ok: false,
      error
    })
  }
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [invitacions, total] = await Promise.all([
    Invitacion.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Invitacion.countDocuments(),
  ])

  res.json({
    ok: true,
    invitacions,
    uid: req.uid,
    total,
  })
}
const getAllInvitacions = async (req, res) => {

  try {
    const [invitacions, total] = await Promise.all([
      Invitacion.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      Invitacion.countDocuments(),
    ])


    res.json({
      ok: true,
      invitacions,
      uid: req.uid,
      total,
    })
  } catch (error) {
    console.error('error::: ', error);
    res.json({
      ok: false,
      error
    })

  }

}

//crearInvitacion Invitacion
const crearInvitacion = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }


  try {


    const invitacion = new Invitacion({
      ...campos
    })


    await invitacion.save()


    res.json({
      ok: true,
      invitacion
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarInvitacion Invitacion
const actualizarInvitacion = async (req, res = response) => {
  //Validar token y comporbar si es el sinvitacion
  const uid = req.params.id
  try {
    const invitacionDB = await Invitacion.findById(uid)
    if (!invitacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un invitacion',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!invitacionDB.google) {
      campos.email = email
    } else if (invitacionDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El invitacion de Google  no se puede actualizar',
      })
    }


    const invitacionActualizado = await Invitacion.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      invitacionActualizado,
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
    const invitacionDB = await Invitacion.findById(uid)
    if (!invitacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un invitacion',
      })
    }
    const campos = req.body
    campos.activated = !invitacionDB.activated
    const invitacionActualizado = await Invitacion.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      invitacionActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getInvitacionById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const invitacionDB = await Invitacion.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!invitacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un invitacion',
      })
    }
    res.json({
      ok: true,
      invitacion: invitacionDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getInvitacionByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const invitacionDB = await Invitacion.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!invitacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un invitacion',
      })
    }
    res.json({
      ok: true,
      invitacion: invitacionDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getInvitacionForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const invitacionDB = await Invitacion.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!invitacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un invitacion',
      })
    }
    res.json({
      ok: true,
      invitacions: invitacionDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getInvitacionByFiesta = async (req, res = response) => {
  const id = req.params.id
  try {
    const invitacionDB = await Invitacion.find({ fiesta: id })
      .populate('fiesta')
      .populate('usuarioCreated')
    if (!invitacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un invitacion',
      })
    }
    res.json({
      ok: true,
      invitacion: invitacionDB[0],
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const deleteInvitacionByUser = async (req, res = response) => {
  const user = req.params.user
  try {
    const invitacionDB = await Invitacion.deleteMany({ $or: [{ userCreated: user }, { usuarioFiesta: user }] })

    if (!invitacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un invitacion',
      })
    }
    res.json({
      ok: true,
      usuario: user,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}


module.exports = {
  getInvitacions,
  crearInvitacion,
  actualizarInvitacion,
  isActive,
  getInvitacionById,
  getAllInvitacions,
  getInvitacionForSln,
  getInvitacionByClave,
  getInvitacionByFiesta,
  deleteInvitacionByUser
}
