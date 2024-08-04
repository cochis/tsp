const { response } = require('express')
const bcrypt = require('bcryptjs')
const Contacto = require('../models/contacto')
const { generarJWT } = require('../helpers/jwt')
const { transporter } = require('../helpers/mailer')

//getContactos Contacto
const getContactos = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [contactos, total] = await Promise.all([
      Contacto.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      Contacto.countDocuments(),
    ])

    res.json({
      ok: true,
      contactos,
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
  const [contactos, total] = await Promise.all([
    Contacto.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Contacto.countDocuments(),
  ])

  res.json({
    ok: true,
    contactos,
    uid: req.uid,
    total,
  })
}
const getAllContactos = async (req, res) => {

  try {
    const [contactos, total] = await Promise.all([
      Contacto.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      Contacto.countDocuments(),
    ])


    res.json({
      ok: true,
      contactos,
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
//crearContacto Contacto
const crearContacto = async (req, res = response) => {

  const campos = {
    ...req.body

  }
  try {
    const contacto = new Contacto({
      ...campos
    })
    await contacto.save()
    res.json({
      ok: true,
      contacto
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}
const sendContact = async (req, res = response) => {
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }
  try {
    await transporter.sendMail({
      from: `"Formulario de contacto" <${campos.email}>`, // sender address
      to: 'info@cochisweb.com', // list of receivers
      subject: "Formulario de contacto", // Subject line
      html: `
          <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <title>Document</title>
</head>

<body>
    <table class="table">
        <thead>
            <tr>
                <h2>Formulario de contacto</h2>
        </thead>
        <tbody>
            <tr>
                <th scope="row">Nombre</th>
                <td>${campos.nombre}</td>

            </tr>
            <tr>
                <th scope="row">Email</th>
                <td>${campos.email}</td>

            </tr>
            <tr>
                <th scope="row">Asunto</th>
                <td>${campos.subject}</td>

            </tr>
            <tr>
                <th scope="row">Mensaje</th>
                <td>${campos.message}</td>

            </tr>

        </tbody>
    </table>
</body>

</html>
          `,
    });
    return res.status(200).json({
      ok: true,
      msg: 'Mensaje envidado',
    })
  } catch (error) {
    console.error('error::: ', error);
    return res.status(400).json({ ok: false, message: 'Algo sacudió mal', error })
  }
}
//actualizarContacto Contacto
const actualizarContacto = async (req, res = response) => {
  //Validar token y comporbar si es el scontacto
  const uid = req.params.id
  try {
    const contactoDB = await Contacto.findById(uid)
    if (!contactoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un contacto',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!contactoDB.google) {
      campos.email = email
    } else if (contactoDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El contacto de Google  no se puede actualizar',
      })
    }


    const contactoActualizado = await Contacto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      contactoActualizado,
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
    const contactoDB = await Contacto.findById(uid)
    if (!contactoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un contacto',
      })
    }
    const campos = req.body
    campos.activated = !contactoDB.activated
    const contactoActualizado = await Contacto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      contactoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getContactoById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const contactoDB = await Contacto.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!contactoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un contacto',
      })
    }
    res.json({
      ok: true,
      contacto: contactoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getContactoByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const contactoDB = await Contacto.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!contactoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un contacto',
      })
    }
    res.json({
      ok: true,
      contacto: contactoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

const getContactoForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const contactoDB = await Contacto.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!contactoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un contacto',
      })
    }
    res.json({
      ok: true,
      contactos: contactoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}





module.exports = {
  getContactos,
  crearContacto,
  actualizarContacto,
  isActive,
  getContactoById,
  getAllContactos,
  getContactoForSln,
  getContactoByClave,
  sendContact
}
