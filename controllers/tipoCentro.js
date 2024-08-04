const { response } = require('express')
const bcrypt = require('bcryptjs')
const TipoCentro = require('../models/tipoCentro')
const { generarJWT } = require('../helpers/jwt')
//getTipoCentros TipoCentro
const getTipoCentros = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [tipoCentros, total] = await Promise.all([
      TipoCentro.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      TipoCentro.countDocuments(),
    ])

    res.json({
      ok: true,
      tipoCentros,
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
  const [tipoCentros, total] = await Promise.all([
    TipoCentro.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    TipoCentro.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoCentros,
    uid: req.uid,
    total,
  })
}
const getAllTipoCentros = async (req, res) => {

  try {
    const [tipoCentros, total] = await Promise.all([
      TipoCentro.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      TipoCentro.countDocuments(),
    ])


    res.json({
      ok: true,
      tipoCentros,
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

//crearTipoCentro TipoCentro
const crearTipoCentro = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }

  try {


    const tipoCentro = new TipoCentro({
      ...campos
    })


    await tipoCentro.save()


    res.json({
      ok: true,
      tipoCentro
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarTipoCentro TipoCentro
const actualizarTipoCentro = async (req, res = response) => {
  //Validar token y comporbar si es el stipoCentro
  const uid = req.params.id
  try {
    const tipoCentroDB = await TipoCentro.findById(uid)
    if (!tipoCentroDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoCentro',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipoCentroDB.google) {
      campos.email = email
    } else if (tipoCentroDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipoCentro de Google  no se puede actualizar',
      })
    }


    const tipoCentroActualizado = await TipoCentro.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoCentroActualizado,
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
    const tipoCentroDB = await TipoCentro.findById(uid)
    if (!tipoCentroDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoCentro',
      })
    }
    const campos = req.body
    campos.activated = !tipoCentroDB.activated
    const tipoCentroActualizado = await TipoCentro.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoCentroActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getTipoCentroById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoCentroDB = await TipoCentro.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoCentroDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoCentro',
      })
    }
    res.json({
      ok: true,
      tipoCentro: tipoCentroDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getTipoCentroByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const tipoCentroDB = await TipoCentro.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoCentroDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoCentro',
      })
    }
    res.json({
      ok: true,
      tipoCentro: tipoCentroDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getTipoCentroForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoCentroDB = await TipoCentro.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoCentroDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoCentro',
      })
    }
    res.json({
      ok: true,
      tipoCentros: tipoCentroDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}



module.exports = {
  getTipoCentros,
  crearTipoCentro,
  actualizarTipoCentro,
  isActive,
  getTipoCentroById,
  getAllTipoCentros,
  getTipoCentroForSln,
  getTipoCentroByClave
}
