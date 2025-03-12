const { response } = require('express')
const bcrypt = require('bcryptjs')
const MailTemplate = require('../models/mailTemplate')
const { generarJWT } = require('../helpers/jwt')
//getMailTemplates MailTemplate
const getMailTemplates = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [mailTemplates, total] = await Promise.all([
    MailTemplate.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    MailTemplate.countDocuments(),
  ])

  res.json({
    ok: true,
    mailTemplates,
    uid: req.uid,
    total,
  })
}
const getAllMailTemplates = async (req, res) => {
  const [mailTemplates, total] = await Promise.all([
    MailTemplate.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    MailTemplate.countDocuments(),
  ])


  res.json({
    ok: true,
    mailTemplates,
    uid: req.uid,
    total,
  })
}

//crearMailTemplate MailTemplate
const crearMailTemplate = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const mailTemplate = new MailTemplate({
      ...campos
    })


    await mailTemplate.save()


    res.json({
      ok: true,
      mailTemplate
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarMailTemplate MailTemplate
const actualizarMailTemplate = async (req, res = response) => {
  //Validar token y comporbar si es el smailTemplate
  const uid = req.params.id
  try {
    const mailTemplateDB = await MailTemplate.findById(uid)
    if (!mailTemplateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un mailTemplate',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!mailTemplateDB.google) {
      campos.email = email
    } else if (mailTemplateDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El mailTemplate de Google  no se puede actualizar',
      })
    }


    const mailTemplateActualizado = await MailTemplate.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      mailTemplateActualizado,
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
    const mailTemplateDB = await MailTemplate.findById(uid)
    if (!mailTemplateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un mailTemplate',
      })
    }
    const campos = req.body
    campos.activated = !mailTemplateDB.activated
    const mailTemplateActualizado = await MailTemplate.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      mailTemplateActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getMailTemplateById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const mailTemplateDB = await MailTemplate.findById(uid)
    if (!mailTemplateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un mailTemplate',
      })
    }
    res.json({
      ok: true,
      mailTemplate: mailTemplateDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getMailTemplatesByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const mailTemplateDB = await MailTemplate.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!mailTemplateDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      mailTemplates: mailTemplateDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getMailTemplates,
  crearMailTemplate,
  actualizarMailTemplate,
  isActive,
  getMailTemplateById,
  getAllMailTemplates,
  getMailTemplatesByEmail

}
