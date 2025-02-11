const { response } = require('express')
const bcrypt = require('bcryptjs')
const Boleto = require('../models/boleto')
const Fiesta = require('../models/fiesta')
const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/jwt')
const { transporter } = require('../helpers/mailer')
//getBoletos Boleto
const getBoletos = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [boletos, total] = await Promise.all([
    Boleto.find({})
      .sort({ nombre: 1 })
      .populate('fiesta', 'nombre,tipoEvento,cantidad,fecha,lugar,img,usuarioCreated,realizada,')
      .skip(desde)
      .limit(cant),
    Boleto.countDocuments(),
  ])

  res.json({
    ok: true,
    boletos,
    uid: req.uid,
    total,
  })
}
const getAllBoletos = async (req, res) => {
  const [boletos, total] = await Promise.all([
    Boleto.find({})


      .populate({
        path: 'fiesta',
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { path: 'salon' }
      })
      .sort({ nombre: 1 }),
    Boleto.countDocuments(),
  ])

  res.json({
    ok: true,
    boletos,
    uid: req.uid,
    total,
  })
}

//crearBoleto Boleto
const crearBoleto = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const boleto = new Boleto({
      ...campos
    })


    await boleto.save()

    res.json({
      ok: true,
      boleto
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}
//crearBoleto Boleto
const dropBoletos = async (req, res = response) => {



  try {

    Boleto.deleteMany({})


    res.json({
      delete: true,

    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarBoleto Boleto
const actualizarBoleto = async (req, res = response) => {
  //Validar token y comporbar si es el sboleto
  const uid = req.params.id

  try {
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!boletoDB.google) {
      campos.email = email
    } else if (boletoDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El boleto de Google  no se puede actualizar',
      })
    }


    const boletoActualizado = await Boleto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      boletoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const setPushBoleto = async (req, res = response) => {
  //Validar token y comporbar si es el sboleto
  const uid = req.params.id

  try {
    const boletoDB = await Boleto.findById(uid)

    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    let bl = {
      ...boletoDB,
      pushNotification: req.body.pushNotification

    }

    const boletoActualizado = await Boleto.findByIdAndUpdate(uid, bl, {
      new: true,
    })
    res.json({
      ok: true,
      boletoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const registrarAsistencia = async (req, res = response) => {
  //Validar token y comporbar si es el sboleto
  const uid = req.params.id
  const boletoDB = await Boleto.findById(uid)
  const fiestaDB = await Fiesta.findById(boletoDB.fiesta)
  const usuarioDB = await Usuario.findById(fiestaDB.usuarioFiesta)

  try {
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    const { ...campos } = req.body

    const boletoActualizado = await Boleto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    let msn = `<!DOCTYPE HTML
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
            color: #363675;
            text-decoration: none;
        }
    </style>



    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet"
        type="text/css">
    <!--<![endif]-->

</head>

<body class="clean-body u_body"
    style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
    <!--[if IE]><div class="ie-container"><![endif]-->
    <!--[if mso]><div class="mso-container"><![endif]-->
    <table id="u_body"
        style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%"
        cellpadding="0" cellspacing="0">
        <tbody>
            <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->



                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #809fa5;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #017ed0;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                                <div class="u-col u-col-100"
                                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                    <div style="height: 100%;width: 100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                            <!--<![endif]-->

                                            <table style="font-family:'Open Sans',sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 19px;font-family:'Open Sans',sans-serif;"
                                                            align="left">

                                                            <table width="100%" cellpadding="0" cellspacing="0"
                                                                border="0">
                                                                <tr>
                                                                    <td style="padding-right: 0px;padding-left: 0px;"
                                                                        align="center">


                                                                        <div
                                                                            style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
                                                                            <p
                                                                                style="font-size: 14px; line-height: 140%;">
                                                                                <span
                                                                                    style="font-size: 28px; line-height: 39.2px;"><strong><span
                                                                                            style="line-height: 39.2px; font-size: 28px;">Hola
                                                                                            <strong
                                                                                                style="color:#13547a"> ${boletoActualizado.nombreGrupo.toUpperCase()}
                                                                                            </strong>
                                                                                            <b style="color:#363675">
                                                                                            Actualizo su boleto
                                                                                            </b >
                                                                                        </span ></strong ></span >
                                                                            </p >
                                                                        </div >

                                                                    </td >
                                                                </tr >
                                                            </table >

                                                        </td >
                                                    </tr >
                                                </tbody >
                                            </table >



                                            <table style="font-family:'Open Sans',sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 26px;font-family:'Open Sans',sans-serif;"
                                                            align="left">


                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
 
                                        </div >
                                    </div >
                                </div >
                               
                            </div >
                        </div >
                    </div >





  <div class="u-row-container" style="padding: 0px;background-color: transparent">
    <div class="u-row"
      style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;">
      <div
        style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #f9f9f9;"><![endif]-->

          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
            <div class="u-col u-col-100"
              style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
              <div style="height: 100%;width: 100% !important;">
                <!--[if (!mso)&(!IE)]><!-->
                <div
                  style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                  <!--<![endif]-->



                  <!--[if (!mso)&(!IE)]><!-->
                </div><!--<![endif]-->
              </div>
            </div>
            <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
      </div>
    </div>
  </div>












                </td >
            </tr >
        </tbody >
    </table >

</body >

</html >
      
      
      `

    await transporter.sendMail({
      from: '"Confirmación" <info@cochisweb.com> ', // sender address
      to: usuarioDB.email, // list of receivers
      subject: `✉ Confirmación de boleto `, // Subject line
      html: msn,
    });
    res.json({
      ok: true,
      boletoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const confirmaBoleto = async (req, res = response) => {
  //Validar token y comporbar si es el sboleto
  const uid = req.params.id
  try {
    const boletoDB = await Boleto.findById(uid)
    const fiestaDB = await Fiesta.findById(boletoDB.fiesta)
    const usuario = await Fiesta.findById(fiestaDB.usuarioCreated)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    const { password, google, email, ...campos } = req.body



    await transporter.sendMail({
      from: '"Confirmación" <info@cochisweb.com> ', // sender address
      to: usuario.email, // list of receivers
      subject: `✉ Confirmación de boleto `, // Subject line
      html: `<!DOCTYPE HTML
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
            color: #363675;
            text-decoration: none;
        }
    </style>



    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet"
        type="text/css">
    <!--<![endif]-->

</head>

<body class="clean-body u_body"
    style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
    <!--[if IE]><div class="ie-container"><![endif]-->
    <!--[if mso]><div class="mso-container"><![endif]-->
    <table id="u_body"
        style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%"
        cellpadding="0" cellspacing="0">
        <tbody>
            <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->



                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #809fa5;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #017ed0;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                                <div class="u-col u-col-100"
                                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                    <div style="height: 100%;width: 100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                            <!--<![endif]-->

                                            <table style="font-family:'Open Sans',sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 19px;font-family:'Open Sans',sans-serif;"
                                                            align="left">

                                                            <table width="100%" cellpadding="0" cellspacing="0"
                                                                border="0">
                                                                <tr>
                                                                    <td style="padding-right: 0px;padding-left: 0px;"
                                                                        align="center">


                                                                        <div
                                                                            style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
                                                                            <p
                                                                                style="font-size: 14px; line-height: 140%;">
                                                                                <span
                                                                                    style="font-size: 28px; line-height: 39.2px;"><strong><span
                                                                                            style="line-height: 39.2px; font-size: 28px;">Hola
                                                                                            <strong
                                                                                                style="color:#13547a"> ${boletoActualizado.nombreGrupo.toUpperCase()}
                                                                                            </strong>
                                                                                            <b style="color:#363675">`+ (boletoActualizado.confirmado) ? 'confirmo su invitación.' : 'a quitado su confirmación' + `
                                                                                            </b >
                                                                                        </span ></strong ></span >
                                                                            </p >
                                                                        </div >

                                                                    </td >
                                                                </tr >
                                                            </table >

                                                        </td >
                                                    </tr >
                                                </tbody >
                                            </table >



                                            <table style="font-family:'Open Sans',sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 26px;font-family:'Open Sans',sans-serif;"
                                                            align="left">


                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <!--[if (!mso)& (!IE)]>< !-->
                                        </div >< !--< ![endif]-- >
                                    </div >
                                </div >
                                < !--[if (mso)| (IE)]></td >< ![endif]-- >
                                < !--[if (mso)| (IE)]></tr ></table ></td ></tr ></table >< ![endif]-- >
                            </div >
                        </div >
                    </div >





  <div class="u-row-container" style="padding: 0px;background-color: transparent">
    <div class="u-row"
      style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;">
      <div
        style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #f9f9f9;"><![endif]-->

          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
            <div class="u-col u-col-100"
              style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
              <div style="height: 100%;width: 100% !important;">
                <!--[if (!mso)&(!IE)]><!-->
                <div
                  style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                  <!--<![endif]-->



                  <!--[if (!mso)&(!IE)]><!-->
                </div><!--<![endif]-->
              </div>
            </div>
            <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
      </div>
    </div>
  </div>












                </td >
            </tr >
        </tbody >
    </table >

</body >

</html >
      
      
      `,
    });

    const boletoActualizado = await Boleto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      boletoActualizado,
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
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    const campos = req.body
    campos.activated = !boletoDB.activated
    const boletoActualizado = await Boleto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      boletoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const isVista = async (req, res = response) => {
  const uid = req.params.id
  try {
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }

    boletoDB.vista = true
    const boletoActualizado = await Boleto.findByIdAndUpdate(uid, boletoDB, {
      new: true,
    })
    res.json({
      ok: true,
      boletoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}
const cambiarBoletos = async (req, res = response) => {
  const uid = req.params.id
  try {
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    const boletoActualizado = await Boleto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      boletoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getBoletoById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    res.json({
      ok: true,
      boleto: boletoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getBoletoByFiesta = async (req, res = response) => {
  const uid = req.params.uid


  try {
    const boletoDB = await Boleto.find({ fiesta: uid })


    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    res.json({
      ok: true,
      boleto: boletoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}


const getBoletosByEmail = async (req, res = response) => {
  const email = req.params.email


  try {
    const boletoDB = await Boleto.find({ usuarioCreated: email })

      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('fiesta')
      .populate({
        path: 'fiesta',
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { path: 'usuarioFiesta' }
      })
      .populate({
        path: 'fiesta',
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { path: 'salon' }
      })
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      boletos: boletoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}



const setPushNotificationBoleto = async (req, res = response) => {
  //Validar token y comporbar si es el sboleto
  const uid = req.params.id

  try {
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    const { ...campos } = req.body

    const boletoActualizado = await Boleto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      boletoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}




module.exports = {
  getBoletos,
  crearBoleto,
  actualizarBoleto,
  isActive,
  getBoletoById,
  getAllBoletos,
  getBoletoByFiesta,
  confirmaBoleto,
  registrarAsistencia,
  getBoletosByEmail,
  setPushNotificationBoleto,
  isVista,
  setPushBoleto,
  cambiarBoletos,
  dropBoletos

}
