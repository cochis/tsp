const { response } = require('express')
const bcrypt = require('bcryptjs')

const Compra = require('../models/compra')
const Paquete = require('../models/paquete')
const Usuario = require('../models/usuario')
const stripeSdkD = require('stripe')('sk_test_51PipskAbE4XYrXNxREoHGBkBAhAE13a2N4IfbhqUKQZp8R8bzHKUtTBifVKyVDF5irB0bVtnmQqiib3JU2KRvuEn00U2nv5EsR');
const stripeSdkP = require('stripe')('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');
const { generarJWT } = require('../helpers/jwt')
//getStripes Stripe


//crearStripe Stripe
const checkout = async (req, res = response) => {
  const { url_success, url_cancel, usuarioCreated, activated, lastEdited, dateCreated, ev } = req.body

  var data
  var uso = []
  var time = []
  try {
    const usuarioDB = await Usuario.findById(usuarioCreated)
    var USR = usuarioDB
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
    var pqs = []
    total = 0
    iva = 0
    subTotal = 0
    var pq
    const items = req.body.items.map((item) => {
      pq = {
        uid: item.uid,
        cantidad: item.value,
        costo: item.costo
      }
      pqs.push(pq)
      total += (item.value * item.costo)
      return {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: item.nombre,
            images: [item.img]
          },
          unit_amount: item.costo * 100
        },
        quantity: item.value
      }
    })
    subTotal = total / 1.16
    iva = subTotal * .16
    var info = {
      activa: true,
      paquetes: pqs,
      total,
      date: Date.now(),
      iva,
      subTotal
    }
    var compra = {
      line_items: [...items],
      mode: 'payment',
      success_url: `${url_success}`,
      cancel_url: `${url_cancel}`
    }
    if (ev == 'D') {
      const session = await stripeSdkD.checkout.sessions.create(compra);
      compra = await {
        ...compra,
        info
      }
      let cp = await {
        id: session.id,
        status: session.status,
        items: compra.line_items,
        info: info
      }

      const paquetesDB = await Paquete.find({})
      var infoPaq
      req.body.items.forEach(async (item, i) => {
        infoPaq = {}
        infoPaq = infoPaq[0]
        infoPaq = paquetesDB.filter((pag) => {
          if (pag._id.toString() === item.uid) {
            return pag
          }
        });
        infoPaq = infoPaq[0]
        if (item.tipoVigencia == 'Uso') {
          let infoUso = await {
            cantidad: (infoPaq.value < 0) ? item.value : item.value * infoPaq.value,
            cantidadUsada: 0,
            tipoPaquete: item.tipoPaquete,
            tipoVigencia: item.tipoVigencia,
            typeOfVigencia: item.typeOfVigencia,
            value: infoPaq.value,
            infoPaq: infoPaq
          }
          await uso.push(infoUso)
        } else {
          let infoTime = await {
            cantidad: (infoPaq.value < 0) ? item.value : item.value * infoPaq.value,
            cantidadUsada: 0,
            tipoPaquete: item.tipoPaquete,
            tipoVigencia: item.tipoVigencia,
            typeOfVigencia: item.typeOfVigencia,
            value: infoPaq.value,
            infoPaq: infoPaq
          }
          await time.push(infoTime)
        }
      });
      data = await {
        id: session.id,
        activated: false,
        uso,
        time
      }
      USR.compras.push(data)
      const usuarioActualizado = await Usuario.findByIdAndUpdate(USR._id, USR, {
        new: true,
      })
      const compraDB = new Compra({
        compra,
        session,
        activated,
        usuarioCreated,
        lastEdited,
        dateCreated
      })
      await compraDB.save()
      res.status(200).json(session)
    } else {

      const session = await stripeSdkP.checkout.sessions.create(compra);
      compra = await {
        ...compra,
        info
      }
      let cp = await {
        id: session.id,
        status: session.status,
        items: compra.line_items,
        info: info
      }

      const paquetesDB = await Paquete.find({})
      var infoPaq
      req.body.items.forEach(async (item, i) => {
        infoPaq = {}
        infoPaq = infoPaq[0]
        infoPaq = paquetesDB.filter((pag) => {
          if (pag._id.toString() === item.uid) {
            return pag
          }
        });
        infoPaq = infoPaq[0]
        if (item.tipoVigencia == 'Uso') {
          let infoUso = await {
            cantidad: (infoPaq.value < 0) ? item.value : item.value * infoPaq.value,
            cantidadUsada: 0,
            usada: false,
            tipoPaquete: item.tipoPaquete,
            tipoVigencia: item.tipoVigencia,
            typeOfVigencia: item.typeOfVigencia,
            value: infoPaq.value,
            infoPaq: infoPaq
          }
          await uso.push(infoUso)
        } else {
          let infoTime = await {
            cantidad: (infoPaq.value < 0) ? item.value : item.value * infoPaq.value,
            cantidadUsada: 0,
            usada: false,
            tipoPaquete: item.tipoPaquete,
            tipoVigencia: item.tipoVigencia,
            typeOfVigencia: item.typeOfVigencia,
            value: infoPaq.value,
            infoPaq: infoPaq
          }
          await time.push(infoTime)
        }
      });
      data = await {
        id: session.id,
        activated: false,
        uso,
        time
      }
      USR.compras.push(data)
      const usuarioActualizado = await Usuario.findByIdAndUpdate(USR._id, USR, {
        new: true,
      })
      const compraDB = new Compra({
        compra,
        session,
        activated,
        usuarioCreated,
        lastEdited,
        dateCreated
      })
      await compraDB.save()
      res.status(200).json(session)
    }



  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}
const checkSession = async (req, res = response) => {
  const session_id = req.params.session_id
  const ev = req.params.ev
  try {
    if (ev == 'D') {
      const session = await stripeSdkD.checkout.sessions.retrieve(session_id);
      res.send({
        session,
        status: session.status,
        customer_email: session.customer_details.email
      });
    } else {
      const session = await stripeSdkP.checkout.sessions.retrieve(session_id);
      res.send({
        session,
        status: session.status,
        customer_email: session.customer_details.email
      });
    }

  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}


module.exports = {
  checkout,
  checkSession
}
