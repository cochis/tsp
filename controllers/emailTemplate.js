const { response } = require('express')
const bcrypt = require('bcryptjs')
const EmailTemplate = require('../models/emailTemplate')
const { generarJWT } = require('../helpers/jwt')
//getEmailTemplates EmailTemplate
const getEmailTemplates = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [emailTemplates, total] = await Promise.all([
    EmailTemplate.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    EmailTemplate.countDocuments(),
  ])

  res.json({
    ok: true,
    emailTemplates,
    uid: req.uid,
    total,
  })
}
const getAllEmailTemplates = async (req, res) => {
  const [emailTemplates, total] = await Promise.all([
    EmailTemplate.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    EmailTemplate.countDocuments(),
  ])

  res.json({
    ok: true,
    emailTemplates,
    uid: req.uid,
    total,
  })
}

//crearEmailTemplate EmailTemplate
const crearEmailTemplate = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const emailTemplate = new EmailTemplate({
      ...campos
    })


    await emailTemplate.save()


    res.json({
      ok: true,
      emailTemplate
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarEmailTemplate EmailTemplate
const actualizarEmailTemplate = async (req, res = response) => {
  //Validar token y comporbar si es el semailTemplate
  const uid = req.params.id
  try {
    const emailTemplateDB = await EmailTemplate.findById(uid)
    if (!emailTemplateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un emailTemplate',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!emailTemplateDB.google) {
      campos.email = email
    } else if (emailTemplateDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El emailTemplate de Google  no se puede actualizar',
      })
    }


    const emailTemplateActualizado = await EmailTemplate.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      emailTemplateActualizado,
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
    const emailTemplateDB = await EmailTemplate.findById(uid)
    if (!emailTemplateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un emailTemplate',
      })
    }
    const campos = req.body
    campos.activated = !emailTemplateDB.activated
    const emailTemplateActualizado = await EmailTemplate.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      emailTemplateActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getEmailTemplateById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const emailTemplateDB = await EmailTemplate.findById(uid)
    if (!emailTemplateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un emailTemplate',
      })
    }
    res.json({
      ok: true,
      emailTemplate: emailTemplateDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getEmailTemplatesByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const emailTemplateDB = await EmailTemplate.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!emailTemplateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      emailTemplates: emailTemplateDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getEmailTemplates,
  crearEmailTemplate,
  actualizarEmailTemplate,
  isActive,
  getEmailTemplateById,
  getAllEmailTemplates,
  getEmailTemplatesByEmail

}
