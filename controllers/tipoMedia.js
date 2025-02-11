const { response } = require('express')
const bcrypt = require('bcryptjs')
const TipoMedia = require('../models/tipoMedia')
const { generarJWT } = require('../helpers/jwt')
//getTipoMedias TipoMedia
const getTipoMedias = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [tipoMedias, total] = await Promise.all([
    TipoMedia.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    TipoMedia.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoMedias,
    uid: req.uid,
    total,
  })
}
const getAllTipoMedias = async (req, res) => {
  const [tipoMedias, total] = await Promise.all([
    TipoMedia.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    TipoMedia.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoMedias,
    uid: req.uid,
    total,
  })
}

//crearTipoMedia TipoMedia
const crearTipoMedia = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const tipoMedia = new TipoMedia({
      ...campos
    })


    await tipoMedia.save()


    res.json({
      ok: true,
      tipoMedia
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarTipoMedia TipoMedia
const actualizarTipoMedia = async (req, res = response) => {
  //Validar token y comporbar si es el stipoMedia
  const uid = req.params.id
  try {
    const tipoMediaDB = await TipoMedia.findById(uid)
    if (!tipoMediaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoMedia',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipoMediaDB.google) {
      campos.email = email
    } else if (tipoMediaDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipoMedia de Google  no se puede actualizar',
      })
    }


    const tipoMediaActualizado = await TipoMedia.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoMediaActualizado,
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
    const tipoMediaDB = await TipoMedia.findById(uid)
    if (!tipoMediaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoMedia',
      })
    }
    const campos = req.body
    campos.activated = !tipoMediaDB.activated
    const tipoMediaActualizado = await TipoMedia.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoMediaActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getTipoMediaById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoMediaDB = await TipoMedia.findById(uid)
    if (!tipoMediaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoMedia',
      })
    }
    res.json({
      ok: true,
      tipoMedia: tipoMediaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getTipoMediasByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const tipoMediaDB = await TipoMedia.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!tipoMediaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      tipoMedias: tipoMediaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getTipoMedias,
  crearTipoMedia,
  actualizarTipoMedia,
  isActive,
  getTipoMediaById,
  getAllTipoMedias,
  getTipoMediasByEmail

}
