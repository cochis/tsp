const { response } = require('express')
const bcrypt = require('bcryptjs')
const Grupo = require('../models/grupo')
const { generarJWT } = require('../helpers/jwt')
//getGrupos Grupo
const getGrupos = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [grupos, total] = await Promise.all([
    Grupo.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Grupo.countDocuments(),
  ])

  res.json({
    ok: true,
    grupos,
    uid: req.uid,
    total,
  })
}
const getAllGrupos = async (req, res) => {
  const [grupos, total] = await Promise.all([
    Grupo.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Grupo.countDocuments(),
  ])

  res.json({
    ok: true,
    grupos,
    uid: req.uid,
    total,
  })
}

//crearGrupo Grupo
const crearGrupo = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }
  try {


    const grupo = new Grupo({
      ...campos
    })


    await grupo.save()


    res.json({
      ok: true,
      grupo
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarGrupo Grupo
const actualizarGrupo = async (req, res = response) => {
  //Validar token y comporbar si es el sgrupo
  const uid = req.params.id
  try {
    const grupoDB = await Grupo.findById(uid)
    if (!grupoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un grupo',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!grupoDB.google) {
      campos.email = email
    } else if (grupoDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El grupo de Google  no se puede actualizar',
      })
    }


    const grupoActualizado = await Grupo.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      grupoActualizado,
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
    const grupoDB = await Grupo.findById(uid)
    if (!grupoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un grupo',
      })
    }
    const campos = req.body
    campos.activated = !grupoDB.activated
    const grupoActualizado = await Grupo.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      grupoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getGrupoById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const grupoDB = await Grupo.findById(uid)
    if (!grupoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un grupo',
      })
    }
    res.json({
      ok: true,
      grupo: grupoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getGruposByEmail = async (req, res = response) => {
  const email = req.params.email

  try {
    const grupoDB = await Grupo.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!grupoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      grupos: grupoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getGrupos,
  crearGrupo,
  actualizarGrupo,
  isActive,
  getGrupoById,
  getAllGrupos,
  getGruposByEmail

}
