const { response } = require('express')
const bcrypt = require('bcryptjs')
const Ejemplo = require('../models/ejemplo')
const { generarJWT } = require('../helpers/jwt')
//getEjemplos Ejemplo
const getEjemplos = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [ejemplos, total] = await Promise.all([
    Ejemplo.find({})
      .sort({ nombre: 1 })
      .populate('fiesta')
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Ejemplo.countDocuments(),
  ])

  res.json({
    ok: true,
    ejemplos,
    uid: req.uid,
    total,
  })
}
const getAllEjemplos = async (req, res) => {
  const [ejemplos, total] = await Promise.all([
    Ejemplo.find({})
      .populate('fiesta')
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Ejemplo.countDocuments(),
  ])

  res.json({
    ok: true,
    ejemplos,
    uid: req.uid,
    total,
  })
}

//crearEjemplo Ejemplo
const crearEjemplo = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const ejemplo = new Ejemplo({
      ...campos
    })


    await ejemplo.save()


    res.json({
      ok: true,
      ejemplo
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarEjemplo Ejemplo
const actualizarEjemplo = async (req, res = response) => {
  //Validar token y comporbar si es el sejemplo
  const uid = req.params.id
  try {
    const ejemploDB = await Ejemplo.findById(uid)
    if (!ejemploDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un ejemplo',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!ejemploDB.google) {
      campos.email = email
    } else if (ejemploDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El ejemplo de Google  no se puede actualizar',
      })
    }


    const ejemploActualizado = await Ejemplo.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      ejemploActualizado,
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
    const ejemploDB = await Ejemplo.findById(uid)
    if (!ejemploDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un ejemplo',
      })
    }
    const campos = req.body
    campos.activated = !ejemploDB.activated
    const ejemploActualizado = await Ejemplo.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      ejemploActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getEjemploById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const ejemploDB = await Ejemplo.findById(uid)
    if (!ejemploDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un ejemplo',
      })
    }
    res.json({
      ok: true,
      ejemplo: ejemploDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getEjemplosByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const ejemploDB = await Ejemplo.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!ejemploDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      ejemplos: ejemploDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getEjemplos,
  crearEjemplo,
  actualizarEjemplo,
  isActive,
  getEjemploById,
  getAllEjemplos,
  getEjemplosByEmail

}
