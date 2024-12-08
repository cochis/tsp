const { response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/jwt')
const { transporter } = require('../helpers/mailer')
//getUsuarios Usuario
const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [usuarios, total] = await Promise.all([
    Usuario.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('role', 'nombre clave _id')
      .populate('tipoCentro', 'nombre clave _id')
      .sort({ apellidoPaterno: -1 })
      .skip(desde)
      .limit(cant),
    Usuario.countDocuments(),
  ])

  res.json({
    ok: true,
    usuarios,
    uid: req.uid,
    total,
  })
}
const getAllUsuarios = async (req, res) => {
  const [usuarios, total] = await Promise.all([
    Usuario.find({})

      .populate('role', 'nombre clave _id')
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('tipoCentro', 'nombre clave _id')
      .sort({ apellidoPaterno: 1 }),
    Usuario.countDocuments(),
  ])

  res.json({
    ok: true,
    usuarios,
    uid: req.uid,
    total,
  })
}

//crearUsuario Usuario
const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  req.body.cantidadFiestas = (req.body.cantidadFiestas === '') ? undefined : req.body.cantidadFiestas
  req.body.paqueteActual = (req.body.paqueteActual === '') ? undefined : req.body.paqueteActual

  try {
    const existeEmail = await Usuario.findOne({ email })

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya está registrado',
      })
    }

    const usuario = new Usuario({
      ...req.body
    })

    //Encriptar contraseña

    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password, salt)

    await usuario.save()
    // Generar el TOKEN - JWT
    const token = await generarJWT(usuario)




    await transporter.sendMail({
      from: '"Verificación de correo" <info@cochisweb.com>', // sender address
      to: usuario.email, // list of receivers
      bcc: 'info@cochisweb.com',
      subject: "Verificación de correo ✔", // Subject line
      html: `
          <!DOCTYPE HTML
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title></title>
  <style type="text/css">
    @media only screen and (min-width: 620px) {
      .u-row {
        width: 600px !important;
      }

      .u-row .u-col {
        vertical-align: top;
      }

      .u-row .u-col-100 {
        width: 600px !important;
      }
    }

    @media (max-width: 620px) {
      .u-row-container {
        max-width: 100% !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
      }

      .u-row .u-col {
        min-width: 320px !important;
        max-width: 100% !important;
        display: block !important;
      }

      .u-row {
        width: 100% !important;
      }

      .u-col {
        width: 100% !important;
      }

      .u-col>div {
        margin: 0 auto;
      }
    }

    body {
      margin: 0;
      padding: 0;
    }

    table,
    tr,
    td {
      vertical-align: top;
      border-collapse: collapse;
    }

    p {
      margin: 0;
    }

    .ie-container table,
    .mso-container table {
      table-layout: fixed;
    }

    * {
      line-height: inherit;
    }

    a[x-apple-data-detectors='true'] {
      color: inherit !important;
      text-decoration: none !important;
    }

    table,
    td {
      color: #000000;
    }

    #u_body a {
      color: #0000ee;
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      #u_content_heading_1 .v-container-padding-padding {
        padding: 40px 10px 0px !important;
      }

      #u_content_heading_1 .v-font-size {
        font-size: 26px !important;
      }

      #u_content_text_1 .v-container-padding-padding {
        padding: 20px 10px 10px !important;
      }

      #u_content_button_1 .v-container-padding-padding {
        padding: 10px 10px 40px !important;
      }

      #u_content_button_1 .v-size-width {
        width: 65% !important;
      }

      #u_content_social_1 .v-container-padding-padding {
        padding: 40px 10px 10px !important;
      }

      #u_content_text_2 .v-container-padding-padding {
        padding: 10px 10px 20px !important;
      }

      #u_content_image_2 .v-container-padding-padding {
        padding: 20px 10px 40px !important;
      }
    }
  </style>



</head>

<body class="clean-body u_body"
  style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #edf4f5;color: #4cb1c0">
  <hr>
  <table id="u_body"
    style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #edf4f5;width:100%"
    cellpadding="0" cellspacing="0">
    <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row"
              style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <div class="u-col u-col-100"
                  style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div style="background-color: #ffffff;height: 100%;width: 100% !important;">
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <table id="u_content_heading_1" style="font-family:arial,helvetica,sans-serif;"
                        role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:50px 10px 0px;font-family:arial,helvetica,sans-serif;"
                              align="left">
                              <h1 class="v-font-size"
                                style="margin: 0px; line-height: 130%; text-align: center; word-wrap: break-word; font-size: 35px; font-weight: 400; color: #0c557b;">
                                <strong>
                                  Bienvenido
                                </strong>
                              </h1>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0"
                        cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:arial,helvetica,sans-serif;"
                              align="left">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                    <img align="center" border="0"
                                      src="https://www.myticketparty.com/assets/images/qr.jpeg" alt="" title=""
                                      style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 380px; margin-top: 50px;"
                                      width="380" />
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table id="u_content_text_1" style="font-family:arial,helvetica,sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:20px 61px 10px;font-family:arial,helvetica,sans-serif;"
                              align="left">
                              <div class="v-font-size"
                                style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
                                <p style="line-height: 140%;"><span
                                    data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoiSVc5SGJhUFNBNnJrTFBpRTl1Q3ZvNCIsInBhc3RlSUQiOjkyNjA4NTgxMiwiZGF0YVR5cGUiOiJzY2VuZSJ9Cg==(/figmeta)--&gt;"
                                    style="line-height: 19.6px; color: #0c557b;">
                                    Por favor entra al siguiente link para verificar tu correo
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table id="u_content_button_1" style="font-family:arial,helvetica,sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 50px;font-family:arial,helvetica,sans-serif;"
                              align="left">
                              <div align="center">
                                <a href="${process.env.URL}auth/verification/${email}" target="_blank"
                                  class="v-button v-size-width v-font-size"
                                  style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #4cb1c0; background-color: #ffffff; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:30%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-color: #4cb1c0; border-top-style: solid; border-top-width: 1px; border-left-color: #4cb1c0; border-left-style: solid; border-left-width: 1px; border-right-color: #4cb1c0; border-right-style: solid; border-right-width: 1px; border-bottom-color: #4cb1c0; border-bottom-style: solid; border-bottom-width: 1px;font-size: 14px;">
                                  <span style="display:block;padding:10px 20px;line-height:120%;"><strong><span
                                        style="line-height: 16.8px;">Activar</span></strong></span>
                                </a>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row"
              style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <div class="u-col u-col-100"
                  style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #0c557b;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <table id="u_content_social_1" style="font-family:arial,helvetica,sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <div style="text-align: center; color:white ; font-weight: 800;">
                          <br>
                          <h3 style="margin: auto; letter-spacing: 3px;">Síguenos</h3>
                        </div>
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 10px;font-family:arial,helvetica,sans-serif;"
                              align="left">
                              <div align="center">
                                <div style="display: table; max-width:167px;">
                                  <table align="center" border="0" cellspacing="0" cellpadding="0" width="32"
                                    height="32"
                                    style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 10px">
                                    <tbody>
                                      <tr style="vertical-align: top">
                                        <td align="center" valign="middle"
                                          style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                          <a href="https://web.facebook.com/people/My-TicketParty/61563610657240/"
                                            title="Facebook" target="_blank">
                                            <img src="https://www.myticketparty.com/assets/icons/facebook-icon.png"
                                              alt="Facebook Ticket Party" title="Facebook Ticket Party" width="32"
                                              style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table align="center" border="0" cellspacing="0" cellpadding="0" width="32"
                                    height="32"
                                    style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
                                    <tbody>
                                      <tr style="vertical-align: top">
                                        <td align="center" valign="middle"
                                          style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                          <a href="https://www.instagram.com/my_ticketparty/" title="Instagram"
                                            target="_blank">
                                            <img src="https://www.myticketparty.com/assets/icons/instagram-icon.png"
                                              alt="Instagram Tycket Party" title="Instagram Tycket Party" width="32"
                                              style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0"
                        cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;"
                              align="left">
                              <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <tbody>
                                  <tr style="vertical-align: top">
                                    <td
                                      style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                      <span>&#160;</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <hr>
</body>

</html>
          `,
    });

    res.json({
      ok: true,
      usuario,
      token,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}
const crearUsuarioSalon = async (req, res = response) => {
  const { email, password } = req.body
  if (req.body.paqueteActual == '') {
    req.body.paqueteActual = undefined
  }
  const uid = req.uid
  try {
    const existeEmail = await Usuario.findOne({ email })
    if (existeEmail) {
      if (!existeEmail.usuarioCreated.includes(uid)) {
        existeEmail.usuarioCreated.push(uid)
      }
      if (!existeEmail.salon.includes(req.body.salon)) {
        existeEmail.salon.push(req.body.salon)
      }
      await existeEmail.save()
      return res.json({
        ok: true,
        existeEmail
      })
    }
    const usuario = new Usuario({
      ...req.body
    })

    //Encriptar contraseña

    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password, salt)

    await usuario.save()
    // Generar el TOKEN - JWT
    const token = await generarJWT(usuario)

    res.json({
      ok: true,
      usuario,
      token,
    })



  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarUsuario Usuario
const actualizarUsuario = async (req, res = response) => {
  //Validar token y comporbar si es el susuario

  const uid = req.params.id
  try {
    const usuarioDB = await Usuario.findById(uid)
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!usuarioDB.google) {
      campos.email = email
    } else if (usuarioDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario de Google  no se puede actualizar',
      })
    }

    if (password && password != null && password !== undefined && password !== '') {

      const salt = bcrypt.genSaltSync()

      let pwd = bcrypt.hashSync(password, salt)


      campos.password = pwd
    }


    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      usuarioActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
//Actualizar Pass  Usuario
const actualizarPassUsuario = async (req, res = response) => {
  //Validar token y comporbar si es el susuario


  const uid = req.params.id
  try {
    const usuarioDB = await Usuario.findById(uid)

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
    const campos = req.body


    const salt = bcrypt.genSaltSync()
    campos.password = bcrypt.hashSync(campos.password, salt)

    let usuarioDB2 = {
      nombre: usuarioDB.nombre,
      apellidoPaterno: usuarioDB.apellidoPaterno,
      apellidoMaterno: usuarioDB.apellidoMaterno,
      email: usuarioDB.email,
      password: campos.password,
      img: usuarioDB.img,
      role: usuarioDB.role,
      google: usuarioDB.google,
      activated: usuarioDB.activated,
      dateCreated: usuarioDB.dateCreated,
      lastEdited: Date.now(),

    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, usuarioDB2, {
      new: true,
    })
    res.json({
      ok: true,
      usuarioActualizado,
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
    const usuarioDB = await Usuario.findById(uid)
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
    const campos = req.body
    campos.activated = !usuarioDB.activated
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
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

const getUsuarioById = async (req, res = response) => {

  const uid = req.params.uid
  try {
    const usuarioDB = await Usuario.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('role')
      .populate('tipoCentro', 'nombre clave _id')
      .populate('salon')
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
    res.json({
      ok: true,
      usuario: usuarioDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getUsuarioByCreador = async (req, res = response) => {
  const creador = req.params.creador

  try {
    const usuarioDB = await Usuario.find({ usuarioCreated: creador })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('role', 'nombre clave _id')
      .populate('tipoCentro', 'nombre clave _id')


    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
    res.json({
      ok: true,
      usuarios: usuarioDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getUsuarioByCreatedUid = async (req, res = response) => {
  const user = req.params.user

  try {
    const usuarioDB = await Usuario.find({ usuarioCreated: user })

      .populate('role', 'nombre clave _id')
      .populate('tipoCentro', 'nombre clave _id')

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }

    res.json({
      ok: true,
      usuarios: usuarioDB,
    })
  } catch (error) {
    console.error('error::: ', error);
    res.status(500).json({
      ok: false,
      error: error,
      msg: 'Error inesperado',
    })
  }
}
const deleteUserUid = async (req, res = response) => {
  const user = req.params.user

  try {
    const usuarioDB = await Usuario.find({ usuarioCreated: user })

      .populate('role', 'nombre clave _id')
      .populate('tipoCentro', 'nombre clave _id')

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }

    res.json({
      ok: true,
      usuarios: usuarioDB,
    })
  } catch (error) {
    console.error('error::: ', error);
    res.status(500).json({
      ok: false,
      error: error,
      msg: 'Error inesperado',
    })
  }
}
const deleteUsersOfUser = async (req, res = response) => {
  const user = req.params.user

  try {
    const usuarioDB = await Usuario.deleteMany({ usuarioCreated: user })
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }

    res.json({
      ok: true,
      usuario: user
    })
  } catch (error) {
    console.error('error::: ', error);
    res.status(500).json({
      ok: false,
      error: error,
      msg: 'Error inesperado',
    })
  }
}
const getUsuarioByEmail = async (req, res = response) => {
  const email = req.params.email

  try {
    const usuarioDB = await Usuario.find({ email: email })

      .populate('role', 'nombre clave _id')

      .populate('tipoCentro', 'nombre clave _id')

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }

    res.json({
      ok: true,
      usuarios: usuarioDB,
    })
  } catch (error) {
    console.error('error::: ', error);
    res.status(500).json({
      ok: false,
      error: error,
      msg: 'Error inesperado',
    })
  }
}


module.exports = {
  getUsuarios,
  crearUsuario,
  crearUsuarioSalon,
  actualizarUsuario,
  isActive,
  getUsuarioById,
  getAllUsuarios,
  actualizarPassUsuario,
  getUsuarioByCreatedUid,
  getUsuarioByEmail,
  getUsuarioByCreador,
  deleteUsersOfUser

}
