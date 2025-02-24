const { response } = require('express')
const bcrypt = require('bcryptjs')
const Email = require('../models/email')
const Fiesta = require('../models/fiesta')
const Cotizacion = require('../models/cotizacion')
const TipoContacto = require('../models/tipoContacto')
const Boleto = require('../models/boleto')
const { generarJWT } = require('../helpers/jwt')
const { transporter } = require('../helpers/mailer')
const sendMail = async (req, res) => {

  const { fiesta, to, sender, boleto, text_url } = req.body
  const fiestaDB = await Fiesta.findById(fiesta)
  const boletoDB = await Boleto.findById(boleto)

  if (!fiestaDB) {
    return res.status(404).json({
      ok: false,
      msg: 'No exite un evento',
    })
  }
  if (boletoDB.email === null || boletoDB.email === null || boletoDB.email === '') {


    return res.status(404).json({
      ok: false,
      fiestaDB,
      boletoDB,
      error: 'Sin Correo'

    })
  }

  var link = ''

  if (fiestaDB.invitacion == 'default') {

    link = `${text_url}core/templates/${fiestaDB.invitacion}/${fiestaDB._id}/${boletoDB._id}`
  } else {

    link = `${text_url}core/invitaciones/xv/xv2/${fiestaDB._id}/${boletoDB._id}`
  }

  let nGrupo = boletoDB.nombreGrupo
  let cantP = fiestaDB.cantidad
  let cantT = (cantP == 1) ? 'Esta' : 'Están'
  let textoP = (cantP == 1) ? 'invitado' : 'invitados'
  let evento = fiestaDB.nombre
  let boletoP = (cantP == 1) ? 'boleto' : 'boletos'

  if (!boletoDB.invitacionEnviada) {
    try {
      await transporter.sendMail({
        from: '"Invitacion" <info@cochisweb.com>', // sender address
        to: boletoDB.email, // list of receivers
        subject: `✉ Invitacion a ${evento.toUpperCase()} `, // Subject line
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
  
      table {
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
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css">
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
  
                        <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 19px;font-family:'Open Sans',sans-serif;"
                                align="left">
  
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
  
  
                                      <div
                                        style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
                                        <p style="font-size: 14px; line-height: 140%;"><span
                                            style="font-size: 28px; line-height: 39.2px;"><strong><span
                                                style="line-height: 39.2px; font-size: 28px;">Hola
                                                ${nGrupo.toUpperCase()}</span></strong></span></p>
                                      </div>
  
                                    </td>
                                  </tr>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Open Sans',sans-serif;"
                                align="left">
  
                                <div
                                  style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 140%;"><span
                                      style="font-size: 28px; line-height: 39.2px;"><strong><span
                                          style="line-height: 39.2px; font-size: 28px;">¡${cantT} ${textoP} a ${evento.toUpperCase()}!</span></strong></span></p>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 26px;font-family:'Open Sans',sans-serif;"
                                align="left">
  
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div><!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
  
  
  
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
  
                        <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Open Sans',sans-serif;"
                                align="left">
  
                                <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                                <div align="center">
  
                               
                                  
                                  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://unlayer.com" style="height:49px; v-text-anchor:middle; width:251px;" arcsize="81.5%"  stroke="f" fillcolor="#1c3861"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
                                  <a href="${link}" target="_blank" class="v-button"
                                    style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #1c3861; border-radius: 40px;-webkit-border-radius: 40px; -moz-border-radius: 40px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                                    <span style="display:block;padding:15px 44px;line-height:120%;"><span
                                        style="font-size: 16px; line-height: 19.2px;"><strong><span
                                            style="line-height: 19.2px; font-size: 16px;">Ver la
                                            invitación</span></strong></span></span>
                                  </a>
                                  <!--[if mso]></center></v:roundrect><![endif]-->
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:'Open Sans',sans-serif;"
                                align="left">
  
  
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
  
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div><!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
  
  
  
  
  
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row"
                style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #839fa5;">
                <div
                  style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #1c3861;"><![endif]-->
  
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div class="u-col u-col-100"
                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                        <!--<![endif]-->
  
                        <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:30px 4px 4px;font-family:'Open Sans',sans-serif;"
                                align="left">
  
                                <div align="center">
                                  <div style="display: table; max-width:254px;">
                                    <!--[if (mso)|(IE)]><table width="254" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:254px;"><tr><![endif]-->
  
  
                                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 19px;" valign="top"><![endif]-->
                                      <p style="font-size: 14px; line-height: 140%;color:white">Confirma tu asistencia<br>Te esperamos .... <br><br> </p>
                                    <!--[if (mso)|(IE)]></td><![endif]-->
  
                                    <!--[if (mso)|(IE)]></td><![endif]-->
  
  
                                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                  </div>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div><!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
  
            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    <!--[if mso]></div><![endif]-->
    <!--[if IE]></div><![endif]-->
  </body>
  
  </html>`,
      });



      boletoDB.invitacionEnviada = true
      const boletoActualizado = await Boleto.findByIdAndUpdate(boletoDB._id, boletoDB, {
        new: true,
      })
      res.json({
        ok: true,
        fiestaDB,
        boletoActualizado,
        to,
        sender,
      })
    } catch (error) {
      console.error('error', error)
      res.status(500).json({
        ok: false,
        msg: 'Error inesperado',
      })
    }
  } else {
    res.json({
      ok: false,
      fiestaDB,
      boletoDB,
      to,
      sender,
    })
  }



}
const reSendMail = async (req, res) => {

  const { fiesta, to, sender, boleto, text_url } = req.body

  const fiestaDB = await Fiesta.findById(fiesta)

  const boletoDB = await Boleto.findById(boleto)

  if (boletoDB.email === null || boletoDB.email === null || boletoDB.email === '') {


    return res.status(500).json({
      ok: false,
      fiestaDB,
      boletoDB,
      error: 'Sin Correo'

    })
  }
  var link = ''
  if (fiestaDB.invitacion == 'default') {

    link = `${text_url}core/templates/${fiestaDB.invitacion}/${fiestaDB._id}/${boletoDB._id}`
  } else {

    link = `${text_url}core/invitaciones/xv/xv2/${fiestaDB._id}/${boletoDB._id}`
  }


  let nGrupo = boletoDB.nombreGrupo

  let cantP = fiestaDB.cantidad
  let cantT = (cantP == 1) ? 'Esta' : 'Están'
  let textoP = (cantP == 1) ? 'invitado' : 'invitados'
  let evento = fiestaDB.nombre
  let boletoP = (cantP == 1) ? 'boleto' : 'boletos'
  try {
    await transporter.sendMail({
      from: '"Invitacion" <info@cochisweb.com>', // sender address
      to: boletoDB.email, // list of receivers
      subject: `✉ Invitacion a ${evento.toUpperCase()} `, // Subject line
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
        color: #363675;
        text-decoration: none;
      }
    </style>
  
  
  
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css">
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
  
                        <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 19px;font-family:'Open Sans',sans-serif;"
                                align="left">
  
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
  
  
                                      <div
                                        style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
                                        <p style="font-size: 14px; line-height: 140%;"><span
                                            style="font-size: 28px; line-height: 39.2px;"><strong><span
                                                style="line-height: 39.2px; font-size: 28px;">Hola
                                                ${nGrupo.toUpperCase()}</span></strong></span></p>
                                      </div>
  
                                    </td>
                                  </tr>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Open Sans',sans-serif;"
                                align="left">
  
                                <div
                                  style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 140%;"><span
                                      style="font-size: 28px; line-height: 39.2px;"><strong><span
                                          style="line-height: 39.2px; font-size: 28px;">¡${cantT} ${textoP} a ${evento.toUpperCase()}!</span></strong></span></p>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 26px;font-family:'Open Sans',sans-serif;"
                                align="left">
  
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div><!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
  
  
  
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
  
                        <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Open Sans',sans-serif;"
                                align="left">
  
                                <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                                <div align="center">
  
                               
                                  
                                  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://unlayer.com" style="height:49px; v-text-anchor:middle; width:251px;" arcsize="81.5%"  stroke="f" fillcolor="#1c3861"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
                                  <a href="${link}" target="_blank" class="v-button"
                                    style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #1c3861; border-radius: 40px;-webkit-border-radius: 40px; -moz-border-radius: 40px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                                    <span style="display:block;padding:15px 44px;line-height:120%;"><span
                                        style="font-size: 16px; line-height: 19.2px;"><strong><span
                                            style="line-height: 19.2px; font-size: 16px;">Ver la
                                            invitación</span></strong></span></span>
                                  </a>
                                  <!--[if mso]></center></v:roundrect><![endif]-->
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:'Open Sans',sans-serif;"
                                align="left">
  
  
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
  
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div><!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
  
  
  
  
  
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row"
                style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #839fa5;">
                <div
                  style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #1c3861;"><![endif]-->
  
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div class="u-col u-col-100"
                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                        <!--<![endif]-->
  
                        <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:30px 4px 4px;font-family:'Open Sans',sans-serif;"
                                align="left">
  
                                <div align="center">
                                  <div style="display: table; max-width:254px;">
                                    <!--[if (mso)|(IE)]><table width="254" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:254px;"><tr><![endif]-->
  
  
                                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 19px;" valign="top"><![endif]-->
                                      <p style="font-size: 14px; line-height: 140%;color:white">Confirma tu asistencia<br>Te esperamos .... <br><br> </p>
                                    <!--[if (mso)|(IE)]></td><![endif]-->
  
                                    <!--[if (mso)|(IE)]></td><![endif]-->
  
  
                                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                  </div>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div><!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
  
            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    <!--[if mso]></div><![endif]-->
    <!--[if IE]></div><![endif]-->
  </body>
  
  </html>`,
    });



    boletoDB.invitacionEnviada = true
    const boletoActualizado = await Boleto.findByIdAndUpdate(boletoDB._id, boletoDB, {
      new: true,
    })

    res.json({
      ok: true,
      fiestaDB,
      boletoActualizado,
      to,
      sender,
    })
  } catch (error) {

    return res.status(500).json({
      ok: false,
      fiestaDB,
      boletoDB,
      error: "Sin Correo"
    })
  }


}
const sendMailByBoleto = async (req, res) => {

  const boleto = req.body


  const text_url = boleto.text_url

  const fiestaDB = await Fiesta.findById(boleto.fiesta)

  const evento = fiestaDB.nombre

  if (boleto.email === null || boleto.email === null || boleto.email === '') {


    return res.status(500).json({
      ok: false,
      fiestaDB,
      boleto,
      error: 'Sin Correo'

    })
  }
  const uid = req.params.boleto
  var link = ''
  if (fiestaDB.invitacion == 'default') {

    link = `${text_url}core/templates/${fiestaDB.invitacion}/${fiestaDB._id}/${uid}`
  } else {

    link = `${text_url}core/invitaciones/xv/xv2/${fiestaDB._id}/${uid}`
  }

  const ToMail = boleto.email
  const sender = "info@cochisweb.com"
  let nGrupo = boleto.nombreGrupo
  let cantP = fiestaDB.cantidad
  let cantT = (cantP == 1) ? 'Esta' : 'Están'
  let textoP = (cantP == 1) ? 'invitado' : 'invitados'

  let boletoP = (cantP == 1) ? 'boleto' : 'boletos'


  try {
    await transporter.sendMail({
      from: '"Invitacion" <info@cochisweb.com>', // sender address
      to: boleto.email, // list of receivers
      subject: `✉ Invitacion a ${evento.toUpperCase()} `, // Subject line
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
          color: #363675;
          text-decoration: none;
        }
      </style>
    
    
    
      <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css">
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
    
                          <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                            cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td
                                  style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 19px;font-family:'Open Sans',sans-serif;"
                                  align="left">
    
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td style="padding-right: 0px;padding-left: 0px;" align="center">
    
    
                                        <div
                                          style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
                                          <p style="font-size: 14px; line-height: 140%;"><span
                                              style="font-size: 28px; line-height: 39.2px;"><strong><span
                                                  style="line-height: 39.2px; font-size: 28px;">Hola
                                                  ${nGrupo.toUpperCase()}</span></strong></span></p>
                                        </div>
    
                                      </td>
                                    </tr>
                                  </table>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                            cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td
                                  style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Open Sans',sans-serif;"
                                  align="left">
    
                                  <div
                                    style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
                                    <p style="font-size: 14px; line-height: 140%;"><span
                                        style="font-size: 28px; line-height: 39.2px;"><strong><span
                                            style="line-height: 39.2px; font-size: 28px;">¡${cantT} ${textoP} a ${evento.toUpperCase()}!</span></strong></span></p>
                                  </div>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                            cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td
                                  style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 26px;font-family:'Open Sans',sans-serif;"
                                  align="left">
    
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <!--[if (!mso)&(!IE)]><!-->
                        </div><!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
    
    
    
    
    
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
    
                          <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                            cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td
                                  style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Open Sans',sans-serif;"
                                  align="left">
    
                                  <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                                  <div align="center">
    
                                 
                                    
                                   
                                    <a href="${link}" target="_blank" class="v-button"
                                      style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #1c3861; border-radius: 40px;-webkit-border-radius: 40px; -moz-border-radius: 40px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                                      <span style="display:block;padding:15px 44px;line-height:120%;"><span
                                          style="font-size: 16px; line-height: 19.2px;"><strong><span
                                              style="line-height: 19.2px; font-size: 16px;">Ver la
                                              invitación</span></strong></span></span>
                                    </a>
                                    
                                  </div>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                            cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td
                                  style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:'Open Sans',sans-serif;"
                                  align="left">
    
    
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
    
    
                          <!--[if (!mso)&(!IE)]><!-->
                        </div><!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
    
    
    
    
    
    
    
    
    
    
              <div class="u-row-container" style="padding: 0px;background-color: transparent">
                <div class="u-row"
                  style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #839fa5;">
                  <div
                    style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #1c3861;"><![endif]-->
    
                    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                    <div class="u-col u-col-100"
                      style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                      <div style="height: 100%;width: 100% !important;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div
                          style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                          <!--<![endif]-->
    
                          <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
                            cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td
                                  style="overflow-wrap:break-word;word-break:break-word;padding:30px 4px 4px;font-family:'Open Sans',sans-serif;"
                                  align="left">
    
                                  <div align="center">
                                    <div style="display: table; max-width:254px;">
                                      <!--[if (mso)|(IE)]><table width="254" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:254px;"><tr><![endif]-->
    
    
                                      <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 19px;" valign="top"><![endif]-->
                                        <p style="font-size: 14px; line-height: 140%;color:white">Confirma tu asistencia<br>Te esperamos .... <br><br> </p>
                                      <!--[if (mso)|(IE)]></td><![endif]-->
    
                                      <!--[if (mso)|(IE)]></td><![endif]-->
    
    
                                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                    </div>
                                  </div>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
    
                          <!--[if (!mso)&(!IE)]><!-->
                        </div><!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
    
    
    
              <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!--[if mso]></div><![endif]-->
      <!--[if IE]></div><![endif]-->
    </body>
    
    </html>`,
    });


    boleto.invitacionEnviada = true
    const boletoActualizado = await Boleto.findByIdAndUpdate(boleto.uid, boleto, {
      new: true,
    })

    return res.json({
      ok: true,
      fiestaDB,
      boletoActualizado,
      to: ToMail,
      sender,
    })
  } catch (error) {
    console.error('error', error)
    return res.status(500).json({
      ok: false,
      fiestaDB,
      boletoActualizado,
      msg: 'Error inesperado',
    })
  }



}




const sendMailCotizacion = async (req, res) => {


  const id = req.params.id
  const data = req.body.productos
  const correo = req.body.correoProveedor


  const cotizacionDB = await Cotizacion.findById(id)



  try {


    var temp = `<!DOCTYPE HTML
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:o="urn:schemas-microsoft-com:office:office">

        <head>

          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta name="x-apple-disable-message-reformatting">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
                    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                    <title>Cotización</title>

                    <style type="text/css">
                      input {
                        width: 100% !important;
                      margin: auto;
        }

                      .text-center {
                        text - align: center !important;
        }

                      .ma {
                        margin: auto !important;
        }
                      .upper {
                       text-transform: uppercase;
        }




                      body {
                        margin: 0;
                      padding: 0;
        }

                      table,
                      tr,
                      td {
                        vertical - align: top;
                      border-collapse: collapse;
        }




                      p {
                        margin: 0;
        }

                      .ie-container table,
                      .mso-container table {
                        table - layout: fixed;
        }

                      * {
                        line - height: inherit;
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




                    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet"
                      type="text/css">



                    </head>

                    <body class="clean-body u_body"
                      style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">

                      <table id="u_body"
                        style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%"
                        cellpadding="0" cellspacing="0">
                        <tbody>
                          <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">



                              <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                <div class="u-row"
                                  style="margin: 0 auto;width: 100%;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #13547a;">
                                  <div
                                    style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">

                                    <div class="u-col u-col-100" style=" display: table-cell;vertical-align: top;">
                                      <div style="height: 100%;width: 100% !important;">

                                        <div
                                          style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">


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
                                                                style="line-height: 39.2px; font-size: 28px;">Cotización
                                                              </span></strong></span>
                                                          </p>
                                                        </div>

                                                      </td>
                                                    </tr>
                                                  </table>

                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>

                                          <table style="font-family:'Open Sans',sans-serif;" role="presentation"
                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                            <tbody>
                                              <tr>
                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Open Sans',sans-serif;"
                                                  align="left">

                                                  <div
                                                    style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
                                                    <p style="font-size: 14px; line-height: 140%;"><span
                                                      style="font-size: 28px; line-height: 39.2px;"><strong><span
                                                        style="line-height: 39.2px; font-size: 28px;">
                                                      </span></strong></span></p>
                                                  </div>

                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>

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


                                        </div>
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              </div>





                              <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                <div class="u-row"
                                  style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;">
                                  <div
                                    style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">

                                    <div class="u-col u-col-100"
                                      style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                      <div style="height: 100%;width: 100% !important;">

                                        <div
                                          style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

                                        </div>
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              </div>





                              <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                <div class="u-row"
                                  style="margin: 0 auto;width:100%;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9; ">
                                  <div
                                    style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">

                                    <div class="u-col u-col-100" style=" display: table-cell;vertical-align: top;">
                                      <div style="height: 100%;width: 100% !important;">

                                        <div
                                          style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

  <div style="width: 100%; margin-top :15px"  align="center">
  <div style="width: 80% ; margin-top :10px "  align="center">
  
  <b class="upper">
Nombre del evento
  </b>
  <label >   ${cotizacionDB.nombreEvento}</label>

  
  </div>
   </div>


  <div style="width: 100%; margin-top :15px"  align="center">
  <div style="width: 80% ; margin-top :10px "  align="center">
  
  <b class="upper">
Nombre del anfitrión
  </b>
  <label  >   ${cotizacionDB.nombreAnf} ${cotizacionDB.apellidoPatAnf} ${cotizacionDB.apellidoMatAnf} </label>

  
  </div>
   </div>


   
  <div style="width: 100%; margin-top :15px"  align="center">
  <div style="width: 80% ; margin-top :10px "  align="center">
  
  <b class="upper">
Teléfono contacto
  </b>
  <label  >   ${cotizacionDB.telfonoAnf} </label>

  
  </div>
   </div>

   
  <div style="width: 100%; margin-top :15px"  align="center">
  <div style="width: 80% ; margin-top :10px "  align="center">
  
  <b class="upper">
Email
  </b>
  <label  >   ${cotizacionDB.emailAnf} </label>

  
  </div>
   </div>
   
  <div style="width: 100%; margin-top :15px"  align="center">
  <div style="width: 80% ; margin-top :10px "  align="center">
  
  <b class="upper">
Dirección
  </b>
  <label  >   ${cotizacionDB.direccion} </label>

  
  </div>
   </div>



                                                
                                              </div>





                                          <form>
                                            <div class="row">

                                            
                                            </div>
                                            <div class="row">
 

 
 `
    if (!cotizacionDB.isAnfitironFestejado && cotizacionDB.nombreFes !== '') {
      temp = temp + `
  <div style="width: 100%; margin-top :15px"  align="center">
  <div style="width: 80% ; margin-top :10px "  align="center">

  <b class="upper">
Nombre del festejado
  </b>
  <label  >   ${cotizacionDB.nombreFes} ${cotizacionDB.apellidoPatFes} ${cotizacionDB.apellidoMatFes} </label>

  
  </div>
   </div>
      
      `



    }

    temp = temp + `


      <div style="width: 100%; margin-top :15px"  align="center">
  <div style="width: 80% ; margin-top :10px "  align="center">

  <b class="upper">
Fecha del evento
  </b>
  <label  > ${await nomberToDate(cotizacionDB.fechaEvento)} </label>

  
  </div>
   </div>


      <div style="width: 100%; margin-top :15px"  align="center">
  <div style="width: 80% ; margin-top :10px "  align="center">

  <b class="upper">
Fecha del evento
  </b>
  <label  > ${await cotizacionDB.direccion} </label>

  
  </div>
   </div>


     
                                             
 

                                          <table style="font-family:'Open Sans',sans-serif;" role="presentation"
                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                            <tbody>
                                              <tr>
                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:'Open Sans',sans-serif;"
                                                  align="left">



                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>

                                          <div>

                                            <div class="col-12 mt-5">
                                              <table class="table" style="width: 100% !important;  overflow: scroll;">
                                                <thead>
                                                  <tr style="text-transform: uppercase;">
                                                     
                                                    <th>Producto</th>
                                                    <th>Proveedor</th>
                                                    <th>Opción</th>
                                                    <th>Precio</th>
                                                    <th>Cantidad</th>
                                                    <th>Total</th>
                                                  </tr>
                                                </thead>
                                                <tbody class="cot"  >`


    for (let i = 0; i < data.length; i++) {





      //<img src="http://localhost:3008/api/upload/proveedores/${data[i].item.photos[0]}"

      temp = temp + `
                                                       <tr  style="text-transform: uppercase;">
                                                      
                                                        <th>
                                                        <a href="https://www.myticketparty.com/core/vista-producto/${data[i].item.uid}" class="upper" tyle="text-decoration:none;color:#13547a">
                                                        ${data[i].item.nombre}
                                                        </a>
                                                        </th>
                                                        <th>

                                                        <a href="https://www.myticketparty.com/core/vista-proveedor/${data[i].item.proveedor._id}" class="upper" style="text-decoration:none;color:#13547a">
                                                        ${data[i].item.proveedor.nombre}
                                                        </a>
                                                        </th>  
                                                        <th  class="upper" style="line-height: 50px;">
                                                           ${data[i].opcion}
                                                        </th>
                                                        <th style="line-height: 50px;">
                                                        `

      if (data[i].item.isBySize) {
        var precio = 0
        for (let k = 0; k < data[i].item.sizes.length; k++) {
          if (data[i].item.sizes[k].nombre == data[i].opcion) {
            precio = Number(data[i].item.sizes[k].precio)
            temp = temp + `<b>${data[i].item.sizes[k].precio}</b>`


          }
        }
      }

      if (data[i].item.isByService) {
        for (let k = 0; k < data[i].item.servicios.length; k++) {
          if (data[i].item.servicios[k].nombre == data[i].opcion) {
            precio = Number(data[i].item.servicios[k].precio)
            temp = temp + `<b>${data[i].item.servicios[k].precio}</b>`

          }
        }
      }

      if (data[i].item.isByColor) {
        for (let k = 0; k < data[i].item.colores.length; k++) {
          if (data[i].item.colores[k].nombre == data[i].opcion) {
            precio = Number(data[i].item.colores[k].precio)
            temp = temp + `<b>${data[i].item.colores[k].precio}</b>`

          }
        }
      }
      if (data[i].item.isByCantidad) {
        for (let k = 0; k < data[i].item.cantidades.length; k++) {
          if (data[i].item.cantidades[k].nombre == data[i].opcion) {
            precio = Number(data[i].item.cantidades[k].precio)
            temp = temp + `<b>${data[i].item.cantidades[k].precio}</b>`

          }
        }
      }



      temp = temp + `    </th>
                                                        <th>
                                                             ${data[i].cantidad}
                                                        </th>
                                                        <th>
                                                            ${data[i].cantidad * precio}
                                                        </th>
                                                    </tr>`

    }



    `<tr class="text-center "  style="text-transform: uppercase;">
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td
                                    style="background-color:  var(--secondary-color) !important; color: var(--primary-color) !important; font-weight: 800;">
                                    Total</td>
                                  <td
                                    style="background-color:  var(--primary-color) !important; color: var(--white-color) !important;font-weight: 500;">
                                    $8003</td>
                                </tr>

                              </tbody>
                            </table>
                          </div>
                        </div>




                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>










            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row"
                style="margin: 0 auto;width: 100%;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #839fa5;">
                <div
                  style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">

                  <div class="u-col u-col-100" style=" display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">

                      <div
                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">


                        <table style="font-family:'Open Sans',sans-serif;" role="presentation"
                          cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:30px  ;font-family:'Open Sans',sans-serif;"
                                align="left">

                                <div align="center">
                                  <div style="display: table;  ">
                                    <a href="https://myticketparty.com" target="_blank">
                                      <label
                                        style="color:white; font-size: 25px;margin-bottom: 25px; font-weight: 800;">MyTicketParty.com</label>
                                      <br>

                                        <img src="https://www.myticketparty.com/assets/images/logo.png"
                                          alt="" style="width: 100px;">
                                        </a>


                                      </div>
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




          </td>
        </tr>
      </tbody>
    </table >

</body >

</html >`







    await transporter.sendMail({
      from: '"Cotizacion" <info@cochisweb.com>', // sender address
      // to: 'info@cochisweb.com', // list of receivers
      bcc: 'info@cochisweb.com,' + cotizacionDB.emailAnf + ',' + correo,
      //to: 'info@cochisweb.com,' + cotizacionDB.emailAnf + ',' + correo,
      subject: `🎉 Cotizacion de evento  🎉 `, // Subject line
      html: temp,
    });



    return res.json({
      ok: true,
      cotizacion: cotizacionDB
    })
  } catch (error) {
    console.error('error', error)
    return res.status(500).json({
      ok: false,
      cotizacionDB,
      msg: 'Error inesperado',
    })
  }



}



const nomberToDate = async (date) => {

  try {
    let today = new Date(date)
    var m = today.getMonth() + 1
    var monthT = m.toString()
    var d = today.getDate()
    var dayT = today.getDate().toString()
    let dt
    if (d < 10) {
      dayT = '0' + d
    }
    if (m < 10) {
      monthT = '0' + m
    }
    var hr = today.getHours()
    var hrT = ''
    if (Number(hr) <= 9) {
      hrT = '0' + hr
    } else {
      hrT = hr.toString()
    }
    var min = today.getMinutes()
    var minT = ''
    if (Number(min) <= 9) {
      minT = '0' + min
    } else {
      minT = min.toString()
    }
    dt = today.getFullYear() + '-' + monthT + '-' + dayT + 'T' + hrT + ':' + minT

    return await dt



  } catch (error) {
    console.error('error::: ', error);

  }
}




module.exports = {
  sendMail,
  sendMailByBoleto,
  reSendMail,
  sendMailCotizacion

}
