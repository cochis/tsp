const { response } = require('express')
const bcrypt = require('bcryptjs')
const TipoColor = require('../models/tipoColor')
const { generarJWT } = require('../helpers/jwt')
//getTipoColors TipoColor
const getTipoColors = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [tipoColors, total] = await Promise.all([
    TipoColor.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    TipoColor.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoColors,
    uid: req.uid,
    total,
  })
}
const getAllTipoColors = async (req, res) => {
  const [tipoColors, total] = await Promise.all([
    TipoColor.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    TipoColor.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoColors,
    uid: req.uid,
    total,
  })
}

//crearTipoColor TipoColor
const crearTipoColor = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const tipoColor = new TipoColor({
      ...campos
    })


    await tipoColor.save()


    res.json({
      ok: true,
      tipoColor
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarTipoColor TipoColor
const actualizarTipoColor = async (req, res = response) => {
  //Validar token y comporbar si es el stipoColor
  const uid = req.params.id
  try {
    const tipoColorDB = await TipoColor.findById(uid)
    if (!tipoColorDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoColor',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipoColorDB.google) {
      campos.email = email
    } else if (tipoColorDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipoColor de Google  no se puede actualizar',
      })
    }


    const tipoColorActualizado = await TipoColor.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoColorActualizado,
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
    const tipoColorDB = await TipoColor.findById(uid)
    if (!tipoColorDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoColor',
      })
    }
    const campos = req.body
    campos.activated = !tipoColorDB.activated
    const tipoColorActualizado = await TipoColor.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoColorActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getTipoColorById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoColorDB = await TipoColor.findById(uid)
    if (!tipoColorDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoColor',
      })
    }
    res.json({
      ok: true,
      tipoColor: tipoColorDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getTipoColorsByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const tipoColorDB = await TipoColor.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!tipoColorDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      tipoColors: tipoColorDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getTipoColors,
  crearTipoColor,
  actualizarTipoColor,
  isActive,
  getTipoColorById,
  getAllTipoColors,
  getTipoColorsByEmail

}
