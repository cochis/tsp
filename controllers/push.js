const { response } = require('express')
const bcrypt = require('bcryptjs')
const Push = require('../models/push')
const { generarJWT } = require('../helpers/jwt')
//getPushs Push
const getPushs = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [pushs, total] = await Promise.all([
      Push.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      Push.countDocuments(),
    ])

    res.json({
      ok: true,
      pushs,
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
  const [pushs, total] = await Promise.all([
    Push.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Push.countDocuments(),
  ])

  res.json({
    ok: true,
    pushs,
    uid: req.uid,
    total,
  })
}
const getAllPushs = async (req, res) => {

  try {
    const [pushs, total] = await Promise.all([
      Push.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      Push.countDocuments(),
    ])


    res.json({
      ok: true,
      pushs,
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

//crearPush Push
const crearPush = async (req, res = response) => {
  const campos = {
    ...req.body
  }

  try {
    const pushDB = await Push.findOne({
      ...campos
    })
    if (pushDB) {
      return res.status(200).json({
        ok: true,
        new: false,
        pushDB
      })
    }
    const push = new Push({
      ...campos
    })
    await push.save()
    res.json({
      ok: true,
      new: true,
      push
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarPush Push
const actualizarPush = async (req, res = response) => {
  //Validar token y comporbar si es el spush
  const uid = req.params.id
  try {
    const pushDB = await Push.findById(uid)
    if (!pushDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un push',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!pushDB.google) {
      campos.email = email
    } else if (pushDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El push de Google  no se puede actualizar',
      })
    }


    const pushActualizado = await Push.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      pushActualizado,
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
    const pushDB = await Push.findById(uid)
    if (!pushDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un push',
      })
    }
    const campos = req.body
    campos.activated = !pushDB.activated
    const pushActualizado = await Push.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      pushActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getPushById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const pushDB = await Push.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!pushDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un push',
      })
    }
    res.json({
      ok: true,
      push: pushDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getPushByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const pushDB = await Push.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!pushDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un push',
      })
    }
    res.json({
      ok: true,
      push: pushDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getPushForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const pushDB = await Push.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!pushDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un push',
      })
    }
    res.json({
      ok: true,
      pushs: pushDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}



module.exports = {
  getPushs,
  crearPush,
  actualizarPush,
  isActive,
  getPushById,
  getAllPushs,
  getPushForSln,
  getPushByClave
}
