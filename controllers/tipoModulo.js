const { response } = require('express')
const bcrypt = require('bcryptjs')
const TipoModulo = require('../models/tipoModulo')
const { generarJWT } = require('../helpers/jwt')
//getTipoModulos TipoModulo
const getTipoModulos = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [tipoModulos, total] = await Promise.all([
      TipoModulo.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      TipoModulo.countDocuments(),
    ])

    res.json({
      ok: true,
      tipoModulos,
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
  const [tipoModulos, total] = await Promise.all([
    TipoModulo.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    TipoModulo.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoModulos,
    uid: req.uid,
    total,
  })
}
const getAllTipoModulos = async (req, res) => {

  try {
    const [tipoModulos, total] = await Promise.all([
      TipoModulo.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      TipoModulo.countDocuments(),
    ])


    res.json({
      ok: true,
      tipoModulos,
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

//crearTipoModulo TipoModulo
const crearTipoModulo = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }

  try {


    const tipoModulo = new TipoModulo({
      ...campos
    })


    await tipoModulo.save()


    res.json({
      ok: true,
      tipoModulo
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarTipoModulo TipoModulo
const actualizarTipoModulo = async (req, res = response) => {
  //Validar token y comporbar si es el stipoModulo
  const uid = req.params.id
  try {
    const tipoModuloDB = await TipoModulo.findById(uid)
    if (!tipoModuloDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoModulo',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipoModuloDB.google) {
      campos.email = email
    } else if (tipoModuloDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipoModulo de Google  no se puede actualizar',
      })
    }


    const tipoModuloActualizado = await TipoModulo.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoModuloActualizado,
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
    const tipoModuloDB = await TipoModulo.findById(uid)
    if (!tipoModuloDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoModulo',
      })
    }
    const campos = req.body
    campos.activated = !tipoModuloDB.activated
    const tipoModuloActualizado = await TipoModulo.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoModuloActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getTipoModuloById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoModuloDB = await TipoModulo.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoModuloDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoModulo',
      })
    }
    res.json({
      ok: true,
      tipoModulo: tipoModuloDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getTipoModuloByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const tipoModuloDB = await TipoModulo.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoModuloDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoModulo',
      })
    }
    res.json({
      ok: true,
      tipoModulo: tipoModuloDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getTipoModuloForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoModuloDB = await TipoModulo.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoModuloDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoModulo',
      })
    }
    res.json({
      ok: true,
      tipoModulos: tipoModuloDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}



module.exports = {
  getTipoModulos,
  crearTipoModulo,
  actualizarTipoModulo,
  isActive,
  getTipoModuloById,
  getAllTipoModulos,
  getTipoModuloForSln,
  getTipoModuloByClave
}
