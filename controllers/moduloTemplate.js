const { response } = require('express')
const bcrypt = require('bcryptjs')
const ModuloTemplate = require('../models/moduloTemplate')
const { generarJWT } = require('../helpers/jwt')
//getModuloTemplates ModuloTemplate
const getModuloTemplates = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [moduloTemplates, total] = await Promise.all([
      ModuloTemplate.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      ModuloTemplate.countDocuments(),
    ])

    res.json({
      ok: true,
      moduloTemplates,
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
  const [moduloTemplates, total] = await Promise.all([
    ModuloTemplate.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    ModuloTemplate.countDocuments(),
  ])

  res.json({
    ok: true,
    moduloTemplates,
    uid: req.uid,
    total,
  })
}
const getAllModuloTemplates = async (req, res) => {

  try {
    const [moduloTemplates, total] = await Promise.all([
      ModuloTemplate.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      ModuloTemplate.countDocuments(),
    ])


    res.json({
      ok: true,
      moduloTemplates,
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

//crearModuloTemplate ModuloTemplate
const crearModuloTemplate = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }
  try {
    const moduloTemplate = new ModuloTemplate({
      ...campos
    })
    await moduloTemplate.save()
    res.json({
      ok: true,
      moduloTemplate
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarModuloTemplate ModuloTemplate
const actualizarModuloTemplate = async (req, res = response) => {
  //Validar token y comporbar si es el smoduloTemplate
  const uid = req.params.id
  try {
    const moduloTemplateDB = await ModuloTemplate.findById(uid)
    if (!moduloTemplateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un moduloTemplate',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!moduloTemplateDB.google) {
      campos.email = email
    } else if (moduloTemplateDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El moduloTemplate de Google  no se puede actualizar',
      })
    }


    const moduloTemplateActualizado = await ModuloTemplate.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      moduloTemplateActualizado,
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
    const moduloTemplateDB = await ModuloTemplate.findById(uid)
    if (!moduloTemplateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un moduloTemplate',
      })
    }
    const campos = req.body
    campos.activated = !moduloTemplateDB.activated
    const moduloTemplateActualizado = await ModuloTemplate.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      moduloTemplateActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getModuloTemplateById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const moduloTemplateDB = await ModuloTemplate.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!moduloTemplateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un moduloTemplate',
      })
    }
    res.json({
      ok: true,
      moduloTemplate: moduloTemplateDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getModuloTemplateByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const moduloTemplateDB = await ModuloTemplate.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!moduloTemplateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un moduloTemplate',
      })
    }
    res.json({
      ok: true,
      moduloTemplate: moduloTemplateDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getModuloTemplateForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const moduloTemplateDB = await ModuloTemplate.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!moduloTemplateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un moduloTemplate',
      })
    }
    res.json({
      ok: true,
      moduloTemplates: moduloTemplateDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}



module.exports = {
  getModuloTemplates,
  crearModuloTemplate,
  actualizarModuloTemplate,
  isActive,
  getModuloTemplateById,
  getAllModuloTemplates,
  getModuloTemplateForSln,
  getModuloTemplateByClave
}
