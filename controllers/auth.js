const { response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario')
const Proveedor = require('../models/proveedor')
const { generarJWT } = require('../helpers/jwt')
const { googleVerify } = require('../helpers/google-verify')
const { transporter } = require('../helpers/mailer')
const EmailTemplate = require('../models/emailTemplate')
const login = async (req, res = response) => {
  const { email, password } = req.body
  try {
    // Verificar     email
    const usuarioDB = await Usuario.findOne({ email })

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Email no encontrado',
      })
    }
    if (!usuarioDB.activated) {
      try {
        const emailTemplate = await EmailTemplate.findOne({ clave: process.env.MAIL_ACT })
        const enlace = `${process.env.URL}auth/verification/${email}`
        emailTemplate.template.replace('[ENLACE_CONFIRMACION]', enlace)
        emailTemplate.template.replace('[NOMBRE_USUARIO]', usuarioDB.nombre)

        await transporter.sendMail({
          from: '"Confirmacion de cuenta de correo de correo" <info@cochisweb.com>', // sender address
          to: email, // list of receivers
          bcc: 'info@cochisweb.com',
          subject: "Confirmacion de cuenta de correo de correo ✔", // Subject line
          html: emailTemplate.template,
        });


        return res.status(404).json({
          ok: false,
          msg: 'Usuario desactivado',
          nombre:usuarioDB.nombre,
          enlace
        })
      } catch (error) {
        console.error('error::: ', error);
        return res.status(400).json({ ok: false, message: 'Algo sacudió mal', error })
      }
    }

    // Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuarioDB.password)
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Contraseña no válida',
      })
    }

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuarioDB)
    const proveedorDB = await Proveedor.find({ usuarioCreated: usuarioDB._id })


    return res.json({
      ok: true,
      token,
      proveedor: [proveedorDB],
      email: usuarioDB.email,
      role: usuarioDB.role,
      uid: usuarioDB._id,
    })
  } catch (error) {
    console.error('error', error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error
    })
  }
}

const loginGoogle = async (req, res = response) => {
  try {
    const token = req.body.token
    const { email, name, picture } = await googleVerify(token)

    const usuarioDB = await Usuario.findOne({ email })
    let usuario
    if (!usuarioDB) {
      usuario = new Usuario({
        nombre: name,
        email,
        password: '@@@',
        img: picture,
        google: true,
      })
    } else {
      usuario = usuarioDB
      usuario.google = true
    }
    await usuario.save()

    const tokenR = await generarJWT(usuario)
    return res.status(200).json({
      ok: true,
      msg: 'Loggin google',
      email,
      name,
      picture,
      token: tokenR,
    })
  } catch (error) {
    console.error('error', error)
    return res.status(400).json({
      ok: false,
      msg: 'Loggin de google no es correcto',
    })
  }
}

const renewToken = async (req, res = response) => {
  const uid = req.uid

  // Generar el TOKEN - JWT
  const usuario = await Usuario.findById(uid)
  const token = await generarJWT(usuario)
  res.json({
    ok: true,
    token,
    usuario,
  })
}
const activeUser = async (req, res = response) => {
  const email = req.params.email.toLowerCase()

  try {
    const usuarioDB = await Usuario.find({ email: email })
    if (!usuarioDB || usuarioDB.length == 0) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
    usuarioDB.activated = true
    const usuarioActualizado = await Usuario.findOneAndUpdate({ email }, { activated: true }, {
      new: true,
    })
    res.json({
      ok: true,
      activated: true,
      usuarioActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}
const existUser = async (req, res = response) => {
  const email = req.params.email.toLowerCase()

  try {
    const usuarioDB = await Usuario.find({ email: email })
    if (!usuarioDB || usuarioDB.length == 0) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
    const token = await generarJWT(usuarioDB)
    res.json({
      ok: true,
      exist: true,
      token: token,
      usuarioDB,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}
module.exports = { login, loginGoogle, renewToken, activeUser, existUser }
