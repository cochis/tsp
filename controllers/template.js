const { response } = require('express')
const bcrypt = require('bcryptjs')
const Template = require('../models/template')
const { generarJWT } = require('../helpers/jwt')
//getTemplates Template
const getTemplates = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [templates, total] = await Promise.all([
      Template.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      Template.countDocuments(),
    ])

    res.json({
      ok: true,
      templates,
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
  const [templates, total] = await Promise.all([
    Template.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Template.countDocuments(),
  ])

  res.json({
    ok: true,
    templates,
    uid: req.uid,
    total,
  })
}
const getAllTemplates = async (req, res) => {

  try {
    const [templates, total] = await Promise.all([
      Template.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      Template.countDocuments(),
    ])


    res.json({
      ok: true,
      templates,
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

//crearTemplate Template
const crearTemplate = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }

  try {


    const template = new Template({
      ...campos
    })


    await template.save()


    res.json({
      ok: true,
      template
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarTemplate Template
const actualizarTemplate = async (req, res = response) => {
  //Validar token y comporbar si es el stemplate
  const uid = req.params.id
  try {
    const templateDB = await Template.findById(uid)
    if (!templateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un template',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!templateDB.google) {
      campos.email = email
    } else if (templateDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El template de Google  no se puede actualizar',
      })
    }


    const templateActualizado = await Template.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      templateActualizado,
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
    const templateDB = await Template.findById(uid)
    if (!templateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un template',
      })
    }
    const campos = req.body
    campos.activated = !templateDB.activated
    const templateActualizado = await Template.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      templateActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getTemplateById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const templateDB = await Template.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!templateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un template',
      })
    }
    res.json({
      ok: true,
      template: templateDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getTemplateByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const templateDB = await Template.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!templateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un template',
      })
    }
    res.json({
      ok: true,
      template: templateDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getTemplateForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const templateDB = await Template.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!templateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un template',
      })
    }
    res.json({
      ok: true,
      templates: templateDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}



module.exports = {
  getTemplates,
  crearTemplate,
  actualizarTemplate,
  isActive,
  getTemplateById,
  getAllTemplates,
  getTemplateForSln,
  getTemplateByClave
}
