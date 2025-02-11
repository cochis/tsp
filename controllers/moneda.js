const { response } = require('express')
const bcrypt = require('bcryptjs')
const Moneda = require('../models/moneda')
const { generarJWT } = require('../helpers/jwt')
//getMonedas Moneda
const getMonedas = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [monedas, total] = await Promise.all([
    Moneda.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Moneda.countDocuments(),
  ])

  res.json({
    ok: true,
    monedas,
    uid: req.uid,
    total,
  })
}
const getAllMonedas = async (req, res) => {
  const [monedas, total] = await Promise.all([
    Moneda.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Moneda.countDocuments(),
  ])

  res.json({
    ok: true,
    monedas,
    uid: req.uid,
    total,
  })
}

//crearMoneda Moneda
const crearMoneda = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const moneda = new Moneda({
      ...campos
    })


    await moneda.save()


    res.json({
      ok: true,
      moneda
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarMoneda Moneda
const actualizarMoneda = async (req, res = response) => {
  //Validar token y comporbar si es el smoneda
  const uid = req.params.id
  try {
    const monedaDB = await Moneda.findById(uid)
    if (!monedaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un moneda',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!monedaDB.google) {
      campos.email = email
    } else if (monedaDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El moneda de Google  no se puede actualizar',
      })
    }


    const monedaActualizado = await Moneda.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      monedaActualizado,
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
    const monedaDB = await Moneda.findById(uid)
    if (!monedaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un moneda',
      })
    }
    const campos = req.body
    campos.activated = !monedaDB.activated
    const monedaActualizado = await Moneda.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      monedaActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getMonedaById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const monedaDB = await Moneda.findById(uid)
    if (!monedaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un moneda',
      })
    }
    res.json({
      ok: true,
      moneda: monedaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getMonedasByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const monedaDB = await Moneda.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!monedaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      monedas: monedaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getMonedas,
  crearMoneda,
  actualizarMoneda,
  isActive,
  getMonedaById,
  getAllMonedas,
  getMonedasByEmail

}
