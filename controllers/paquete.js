const { response } = require('express')
const bcrypt = require('bcryptjs')
const Paquete = require('../models/paquete')
const { generarJWT } = require('../helpers/jwt')
//getPaquetes Paquete
const getPaquetes = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [paquetes, total] = await Promise.all([
    Paquete.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Paquete.countDocuments(),
  ])

  res.json({
    ok: true,
    paquetes,
    uid: req.uid,
    total,
  })
}
const getAllPaquetes = async (req, res) => {
  const [paquetes, total] = await Promise.all([
    Paquete.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ dateCreated: 1 }),
    Paquete.countDocuments(),
  ])

  res.json({
    ok: true,
    paquetes,
    uid: req.uid,
    total,
  })
}

//crearPaquete Paquete
const crearPaquete = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const paquete = new Paquete({
      ...campos
    })


    await paquete.save()


    res.json({
      ok: true,
      paquete
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarPaquete Paquete
const actualizarPaquete = async (req, res = response) => {
  //Validar token y comporbar si es el spaquete
  const uid = req.params.id
  try {
    const paqueteDB = await Paquete.findById(uid)
    if (!paqueteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un paquete',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!paqueteDB.google) {
      campos.email = email
    } else if (paqueteDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El paquete de Google  no se puede actualizar',
      })
    }


    const paqueteActualizado = await Paquete.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      paqueteActualizado,
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
    const paqueteDB = await Paquete.findById(uid)
    if (!paqueteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un paquete',
      })
    }
    const campos = req.body
    campos.activated = !paqueteDB.activated
    const paqueteActualizado = await Paquete.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      paqueteActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getPaqueteById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const paqueteDB = await Paquete.findById(uid)
    if (!paqueteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un paquete',
      })
    }
    res.json({
      ok: true,
      paquete: paqueteDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getPaqueteByClave = async (req, res = response) => {

  const clave = req.params.clave
  try {
    const paqueteDB = await Paquete.find({ clave: clave })
    if (!paqueteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un paquete',
      })
    }
    res.json({
      ok: true,
      paquete: paqueteDB[0],
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getPaquetesByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const paqueteDB = await Paquete.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!paqueteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      paquetes: paqueteDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getPaquetes,
  crearPaquete,
  actualizarPaquete,
  isActive,
  getPaqueteById,
  getAllPaquetes,
  getPaquetesByEmail,
  getPaqueteByClave

}
