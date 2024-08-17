const { response } = require('express')
const bcrypt = require('bcryptjs')
const Parametro = require('../models/parametro')
const { generarJWT } = require('../helpers/jwt')
//getParametros Parametro
const getParametros = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [parametros, total] = await Promise.all([
    Parametro.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Parametro.countDocuments(),
  ])

  res.json({
    ok: true,
    parametros,
    uid: req.uid,
    total,
  })
}
const getAllParametros = async (req, res) => {
  const [parametros, total] = await Promise.all([
    Parametro.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Parametro.countDocuments(),
  ])

  res.json({
    ok: true,
    parametros,
    uid: req.uid,
    total,
  })
}

//crearParametro Parametro
const crearParametro = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const parametro = new Parametro({
      ...campos
    })


    await parametro.save()


    res.json({
      ok: true,
      parametro
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarParametro Parametro
const actualizarParametro = async (req, res = response) => {
  //Validar token y comporbar si es el sparametro
  const uid = req.params.id
  try {
    const parametroDB = await Parametro.findById(uid)
    if (!parametroDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un parametro',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!parametroDB.google) {
      campos.email = email
    } else if (parametroDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El parametro de Google  no se puede actualizar',
      })
    }


    const parametroActualizado = await Parametro.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      parametroActualizado,
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
    const parametroDB = await Parametro.findById(uid)
    if (!parametroDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un parametro',
      })
    }
    const campos = req.body
    campos.activated = !parametroDB.activated
    const parametroActualizado = await Parametro.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      parametroActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getParametroById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const parametroDB = await Parametro.findById(uid)
    if (!parametroDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un parametro',
      })
    }
    res.json({
      ok: true,
      parametro: parametroDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getParametrosByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const parametroDB = await Parametro.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!parametroDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      parametros: parametroDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getParametrosByClave = async (req, res = response) => {
  const clave = req.params.clave



  try {
    const parametroDB = await Parametro.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!parametroDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      parametro: parametroDB[0],
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
module.exports = {
  getParametros,
  crearParametro,
  actualizarParametro,
  isActive,
  getParametroById,
  getAllParametros,
  getParametrosByEmail,
  getParametrosByClave

}
