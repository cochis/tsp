const { response } = require('express')
const bcrypt = require('bcryptjs')
const Cotizacion = require('../models/cotizacion')
const EstatusCotizacion = require('../models/estatusCotizacion')
const { generarJWT } = require('../helpers/jwt')
const { transporter } = require('../helpers/mailer')
//getCotizaciones Cotizacion
const getCotizaciones = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [cotizaciones, total] = await Promise.all([
    Cotizacion.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('estatusCotizacion')
      .populate('proveedor')
      .skip(desde)
      .limit(cant),
    Cotizacion.countDocuments(),
  ])

  res.json({
    ok: true,
    cotizaciones,
    uid: req.uid,
    total,
  })
}
const getAllCotizaciones = async (req, res) => {
  const [cotizaciones, total] = await Promise.all([
    Cotizacion.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('estatusCotizacion')
      .populate('proveedor')
      .sort({ nombre: 1 }),
    Cotizacion.countDocuments(),
  ])

  res.json({
    ok: true,
    cotizaciones,
    uid: req.uid,
    total,
  })
}

//crearCotizacion Cotizacion
const crearCotizacion = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const cotizacion = new Cotizacion({
      ...campos
    })


    await cotizacion.save()


    res.json({
      ok: true,
      cotizacion
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarCotizacion Cotizacion
const actualizarCotizacion = async (req, res = response) => {
  //Validar token y comporbar si es el scotizacion
  const uid = req.params.id

  try {
    const cotizacionDB = await Cotizacion.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('estatusCotizacion')
      .populate('proveedor')
    if (!cotizacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un cotizacion',
      })
    }
    const { password, google, email, ...campos } = req.body



    const estatusCotizacionDB = await EstatusCotizacion.findById(campos.estatusCotizacion)
    if (estatusCotizacionDB.clave == process.env.FinCotizacion) {


      cotizacionDB.productos.forEach(prd => {
        prd.item.proveedor = undefined
        prd.item.categoriaItem = undefined
        prd.item.photos = undefined


      });


      const cotizacionActualizado = await Cotizacion.findByIdAndUpdate(uid, campos, {
        new: true,
      })

      var mail = `<!DOCTYPE HTML
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
                width: 80% !important;
            }

            .u-row .u-col {
                vertical-align: top;
            }

            .u-row .u-col-100 {
                width: 80% !important;
            }
        }

        @media (max-width: 620px) {
            .u-row-container {
                max-width: 100% !important;
                padding-left: 0px !important;
                padding-right: 0px !important;
            }

            .u-row .u-col {
                min-width: 450px !important;
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
        .upper{
        text-transform: uppercase;
        }
    </style>




    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet"
        type="text/css">


</head>

<body class="clean-body u_body upper"
    style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
<form method="post">
    <table id="u_body"
        style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 450px;Margin: 0 auto;background-color: #ffffff;width:100%"
        cellpadding="0" cellspacing="0">
        <tbody>
            <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">



                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="margin: 0 auto;min-width: 450px;max-width: 80%;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #52b3c1;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">

                                <div class="u-col u-col-100"
                                    style="max-width: 450px;min-width: 80%;display: table-cell;vertical-align: top;">
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
                                                                            <div style="    background-color: #1c3861;
    padding: 15px;
    max-width: 200px;
    margin: auto;
    border-radius: 20px;
    box-shadow: 4px 4px 4px -2px;
    margin-bottom: 15px;">

                                                                                <img src="https://www.myticketparty.com/assets/images/lg.png"
                                                                                    alt="MyTicketParty.com">
                                                                            </div>
                                                                            <p
                                                                                style="font-size: 14px; line-height: 140%;">
                                                                                <span
                                                                                    style="font-size: 28px; line-height: 39.2px;"><strong><span
                                                                                            style="line-height: 39.2px; font-size: 18px;">Para
                                                                                            nosotros es importante su
                                                                                            valoración de los servicios
                                                                                            y productos de nuestros
                                                                                            proveedores</span></strong></span>
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
                            style="margin: 0 auto;min-width: 450px;max-width: 80%;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #52b3c1;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">

                                <div class="u-col u-col-100"
                                    style="max-width: 450px;min-width: 80%;display: table-cell;vertical-align: top;">
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
                            style="margin: 0 auto;min-width: 450px;max-width: 80%;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">

                                <div class="u-col u-col-100"
                                    style="max-width: 450px;min-width: 80%;display: table-cell;vertical-align: top;">
                                    <div style="height: 100%;width: 100% !important;">

                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">


                                            <table style="font-family:'Open Sans',sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Open Sans',sans-serif;"
                                                            align="left">


                                                            <div align="center">



                                                                <a href="https://www.myticketparty.com/core/calificacion/productos/${cotizacionDB._id}" target="_blank" class="v-button"
                                                                    style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #1c3861; border-radius: 40px;-webkit-border-radius: 40px; -moz-border-radius: 40px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                                                                    <span
                                                                        style="display:block;padding:15px 44px;line-height:120%;"><span
                                                                            style="font-size: 16px; line-height: 19.2px;"><strong><span
                                                                                    style="line-height: 19.2px; font-size: 16px;">Calificar</span></strong></span></span>
                                                                </a>

                                                            </div>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

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




                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>










                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="margin: 0 auto;min-width: 450px;max-width: 80%;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #52b3c1;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">

                                <div class="u-col u-col-100"
                                    style="max-width: 450px;min-width: 80%;display: table-cell;vertical-align: top;">
                                    <div style="height: 100%;width: 100% !important;">

                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

                                            <table style="font-family:'Open Sans',sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 4px 4px;font-family:'Open Sans',sans-serif;"
                                                            align="left">

                                                            <div align="center">
                                                                <div style="display: table; max-width:254px;">

                                                                    <p
                                                                        style="font-size: 14px; line-height: 140%;color:white">
                                                                        <br>Te agradecemos por tu tiempo
                                                                        <br><br>
                                                                    </p>

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
    </table>
</form>

  

    
</body>

                  </html>`
      await transporter.sendMail({
        from: '"Valoracion" <info@cochisweb.com>', // sender address
        // to: 'info@cochisweb.com', // list of receivers
        bcc: 'info@cochisweb.com,' + cotizacionDB.emailAnf,
        //to: 'info@cochisweb.com,' + cotizacionDB.emailAnf + ',' + correo,
        subject: `🎉 Valoración de nuestros productos y servicios  🎉 `, // Subject line
        html: mail,
      });


      res.json({
        ok: true,
        cotizacionActualizado,
      })
    } else {

      const cotizacionActualizado = await Cotizacion.findByIdAndUpdate(uid, campos, {
        new: true,
      })
      res.json({
        ok: true,
        cotizacionActualizado,
      })

    }









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
    const cotizacionDB = await Cotizacion.findById(uid)
    if (!cotizacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un cotizacion',
      })
    }
    const campos = req.body
    campos.activated = !cotizacionDB.activated
    const cotizacionActualizado = await Cotizacion.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      cotizacionActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getCotizacionById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const cotizacionDB = await Cotizacion.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('estatusCotizacion')
      .populate('proveedor')
    if (!cotizacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un cotizacion',
      })
    }
    res.json({
      ok: true,
      cotizacion: cotizacionDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getCotizacionesByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const cotizacionDB = await Cotizacion.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('estatusCotizacion')
      .populate('proveedor')
    if (!cotizacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      cotizaciones: cotizacionDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getCotizacionesByProveedor = async (req, res = response) => {
  const id = req.params.id



  try {
    const cotizacionDB = await Cotizacion.find({ proveedor: id })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('estatusCotizacion')
      .populate('proveedor')
    if (!cotizacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      cotizaciones: cotizacionDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getCotizacionesByCreador = async (req, res = response) => {
  const id = req.params.id

  try {
    const cotizacionDB = await Cotizacion.find({ usuarioCreated: id })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('estatusCotizacion')
      .populate('proveedor')


    if (!cotizacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      cotizaciones: cotizacionDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getCotizaciones,
  crearCotizacion,
  actualizarCotizacion,
  isActive,
  getCotizacionById,
  getAllCotizaciones,
  getCotizacionesByEmail,
  getCotizacionesByProveedor,
  getCotizacionesByCreador

}
