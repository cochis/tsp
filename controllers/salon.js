const { response } = require('express')
const bcrypt = require('bcryptjs')
const Salon = require('../models/salon')
const { generarJWT } = require('../helpers/jwt')
//getSalons Salon
const getSalons = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [salons, total] = await Promise.all([
    Salon.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Salon.countDocuments(),
  ])

  res.json({
    ok: true,
    salons,
    uid: req.uid,
    total,
  })
}
const getAllSalons = async (req, res) => {
  const [salons, total] = await Promise.all([
    Salon.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Salon.countDocuments(),
  ])

  res.json({
    ok: true,
    salons,
    uid: req.uid,
    total,
  })
}

//crearSalon Salon
const crearSalon = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }
  try {


    const salon = new Salon({
      ...campos
    })


    await salon.save()


    res.json({
      ok: true,
      salon
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarSalon Salon
const actualizarSalon = async (req, res = response) => {
  //Validar token y comporbar si es el ssalon
  const uid = req.params.id
  try {
    const salonDB = await Salon.findById(uid)
    if (!salonDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    const { ...campos } = req.body



    const salonActualizado = await Salon.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      salonActualizado,
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
    const salonDB = await Salon.findById(uid)
    if (!salonDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    const campos = req.body
    campos.activated = !salonDB.activated
    const salonActualizado = await Salon.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      salonActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getSalonById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const salonDB = await Salon.findById(uid)
    if (!salonDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      salon: salonDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getSalonByEmail = async (req, res = response) => {
  const email = req.params.email

  try {
    const salonDB = await Salon.find({ email: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!salonDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      salons: salonDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getSalonByCreador = async (req, res = response) => {
  const uid = req.params.uid

  try {
    const salonDB = await Salon.find({ usuarioCreated: uid })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!salonDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      salons: salonDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const deleteSalonByUser = async (req, res = response) => {
  const user = req.params.user

  try {
    const salonDB = await Salon.deleteMany({ usuarioCreated: user })
    if (!salonDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
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
  getSalons,
  crearSalon,
  actualizarSalon,
  isActive,
  getSalonById,
  getAllSalons,
  getSalonByEmail,
  getSalonByCreador,
  deleteSalonByUser

}
