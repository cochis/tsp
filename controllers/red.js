const { response } = require('express')
const bcrypt = require('bcryptjs')
const Red = require('../models/red')
const { generarJWT } = require('../helpers/jwt')
//getRedes Red
const getRedes = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [redes, total] = await Promise.all([
    Red.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Red.countDocuments(),
  ])

  res.json({
    ok: true,
    redes,
    uid: req.uid,
    total,
  })
}
const getAllRedes = async (req, res) => {
  const [redes, total] = await Promise.all([
    Red.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Red.countDocuments(),
  ])

  res.json({
    ok: true,
    redes,
    uid: req.uid,
    total,
  })
}

//crearRed Red
const crearRed = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const red = new Red({
      ...campos
    })


    await red.save()


    res.json({
      ok: true,
      red
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarRed Red
const actualizarRed = async (req, res = response) => {
  //Validar token y comporbar si es el sred
  const uid = req.params.id
  try {
    const redDB = await Red.findById(uid)
    if (!redDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un red',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!redDB.google) {
      campos.email = email
    } else if (redDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El red de Google  no se puede actualizar',
      })
    }


    const redActualizado = await Red.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      redActualizado,
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
    const redDB = await Red.findById(uid)
    if (!redDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un red',
      })
    }
    const campos = req.body
    campos.activated = !redDB.activated
    const redActualizado = await Red.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      redActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getRedById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const redDB = await Red.findById(uid)
    if (!redDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un red',
      })
    }
    res.json({
      ok: true,
      red: redDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getRedesByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const redDB = await Red.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!redDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      redes: redDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getRedes,
  crearRed,
  actualizarRed,
  isActive,
  getRedById,
  getAllRedes,
  getRedesByEmail

}
