const { response } = require('express')
const bcrypt = require('bcryptjs')
const Pais = require('../models/pais')
const { generarJWT } = require('../helpers/jwt')
//getPaises Pais
const getPaises = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [paises, total] = await Promise.all([
    Pais.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Pais.countDocuments(),
  ])

  res.json({
    ok: true,
    paises,
    uid: req.uid,
    total,
  })
}
const getAllPaises = async (req, res) => {
  const [paises, total] = await Promise.all([
    Pais.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Pais.countDocuments(),
  ])

  res.json({
    ok: true,
    paises,
    uid: req.uid,
    total,
  })
}

//crearPais Pais
const crearPais = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const pais = new Pais({
      ...campos
    })


    await pais.save()


    res.json({
      ok: true,
      pais
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarPais Pais
const actualizarPais = async (req, res = response) => {
  //Validar token y comporbar si es el spais
  const uid = req.params.id
  try {
    const paisDB = await Pais.findById(uid)
    if (!paisDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un pais',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!paisDB.google) {
      campos.email = email
    } else if (paisDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El pais de Google  no se puede actualizar',
      })
    }


    const paisActualizado = await Pais.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      paisActualizado,
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
    const paisDB = await Pais.findById(uid)
    if (!paisDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un pais',
      })
    }
    const campos = req.body
    campos.activated = !paisDB.activated
    const paisActualizado = await Pais.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      paisActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getPaisById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const paisDB = await Pais.findById(uid)
    if (!paisDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un pais',
      })
    }
    res.json({
      ok: true,
      pais: paisDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getPaisesByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const paisDB = await Pais.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!paisDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      paises: paisDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getPaises,
  crearPais,
  actualizarPais,
  isActive,
  getPaisById,
  getAllPaises,
  getPaisesByEmail

}
