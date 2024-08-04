const { response } = require('express')
const webpush = require('web-push')
const bcrypt = require('bcryptjs')
const TokenPush = require('../models/tokenPush')
const Usuario = require('../models/usuario')
const Boleto = require('../models/boleto')
const Push = require('../models/push')
const { generarJWT } = require('../helpers/jwt')

//getTokenPushs TokenPush
const getTokenPushs = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [tokenPushs, total] = await Promise.all([
    TokenPush.find({})
      .sort({ nombre: 1 })
      .populate('tokenPushCreated', 'nombre , email')
      .skip(desde)
      .limit(cant),
    TokenPush.countDocuments(),
  ])

  res.json({
    ok: true,
    tokenPushs,
    uid: req.uid,
    total,
  })
}
const getAllTokenPushs = async (req, res) => {
  const [tokenPushs, total] = await Promise.all([
    TokenPush.find({})
      .sort({ nombre: 1 }),
    TokenPush.countDocuments(),
  ])

  res.json({
    ok: true,
    tokenPushs,
    uid: req.uid,
    total,
  })
}
//crearTokenPush TokenPush
const crearTokenPush = async (req, res = response) => {
  const tok = req.body.tokenPush
  let fst = []
  fst.push(req.body.fiesta)
  const campos = {
    ...req.body,
    fiestas: fst

  }
  try {
    const tokenPushDB = await TokenPush.find({ tokenPush: tok })

    if (!tokenPushDB) {
      const tokenPush = new TokenPush({
        ...campos
      })
      await tokenPush.save()
      res.json({
        ok: true,
        tokenPush
      })
    } else {
      const tokenByParty = TokenPush.find({
        fiestas: { $all: [req.body.fiesta] }

      });
    }
    res.json({
      ok: true,
      tokenPush: tokenPushDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }


}
//actualizarTokenPush TokenPush
const actualizarTokenPush = async (req, res = response) => {
  //Validar token y comporbar si es el stokenPush
  const uid = req.params.id
  try {
    const tokenPushDB = await TokenPush.findById(uid)
    if (!tokenPushDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tokenPush',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tokenPushDB.google) {
      campos.email = email
    } else if (tokenPushDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tokenPush de Google  no se puede actualizar',
      })
    }


    const tokenPushActualizado = await TokenPush.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tokenPushActualizado,
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
    const tokenPushDB = await TokenPush.findById(uid)
    if (!tokenPushDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tokenPush',
      })
    }
    const campos = req.body
    campos.activated = !tokenPushDB.activated
    const tokenPushActualizado = await TokenPush.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tokenPushActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}
const getTokenPushById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tokenPushDB = await TokenPush.findById(uid)
    if (!tokenPushDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tokenPush',
      })
    }
    res.json({
      ok: true,
      tokenPush: tokenPushDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const enviarNotificacion = async (req, res = response) => {

  const vapidKey = {
    "publicKey": process.env.PUBLICKEY,
    "privateKey": process.env.PRIVATEDKEY
  }

  webpush.setVapidDetails(
    'mailto:info@cochisweb.com',
    vapidKey.publicKey,
    vapidKey.privateKey
  );


  const pushNotification = {
    endpoint: "https://fcm.googleapis.com/fcm/send/dYsRc_IsvMc:APA91bEhkUKIv24i5L-rn6InEf48Gp6OJ68ch9huJShfIKsH2cj3d6-JxQVRvfdev2xFT8uqZL7BR7swYZtk83lhExHaF8vCYaB_93adJ4CSkbGDzdBukuteEyUPhja7LfsBjjPIwrDJ",
    keys: {
      p256dh: "BCZW46pJuh2IQobGyO7Ikk2lIQLGwn8UoFwdFiZFRdgsbG8cx1jDpr2DIp6YzuQoLu9BJAcDpOHdHhd3wVabonA",
      auth: "SHNX1ESj3FFU2f-FNRmnOg"
    }


  }

  const payload = {
    "notification": {
      "title": "Saludo",
      "body": "Que pacho",
      "vibrate": [100, 50, 100],
      "image": "http://localhost:4200/assets/invitaciones/xv/july.jpeg",
      "data": {
        "dateOfArrival": Date.now(),
        "primaryKey": 1
      },
      "actions": [{
        "action": "explore",
        "title": "Te falta dios"
      }]
    }
  }
  webpush.sendNotification(
    pushNotification,
    JSON.stringify(payload)).then(ress => {

      return res.status(200).json({
        ok: true,
        payload: payload,
        res: ress
      })

    }).catch(err => {
      console.error('err', err);
      res.status(500).json({
        ok: false,
        msg: err,
      })

    })




  /* try {
    const tokenPushDB = await TokenPush.findById(uid)
    if (!tokenPushDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tokenPush',
      })
    }
    res.json({
      ok: true,
      tokenPush: tokenPushDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  } */
}
const enviarNotificacionToUser = async (req, res = response) => {


  const uid = req.params.uid
  const payload = {
    ...req.body
  }

  try {
    const usuarioDB = await Usuario.findById(uid)



    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }


    const vapidKey = {
      "publicKey": process.env.PUBLICKEY,
      "privateKey": process.env.PRIVATEDKEY
    }

    webpush.setVapidDetails(
      'mailto:info@cochisweb.com',
      vapidKey.publicKey,
      vapidKey.privateKey
    );


    // console.log('usuarioDB.pushNotification::: ', usuarioDB.pushNotification);

    var ressPush = []
    var ressError = []
    if (usuarioDB.pushNotification.length > 0) {

      usuarioDB.pushNotification.forEach(element => {
        webpush.sendNotification(element, JSON.stringify(payload)).then(resPush => {


          ressPush.push(resPush)
        }).catch(err => {
          console.error('err', err);
          ressError.push(err)

        })
      });
    }


    res.status(200).json({
      ok: true,
      res: ressPush,
      resError: ressError
    })


  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: error,
    })
  }




  /* try {
    const tokenPushDB = await TokenPush.findById(uid)
    if (!tokenPushDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tokenPush',
      })
    }
    res.json({
      ok: true,
      tokenPush: tokenPushDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  } */
}
const enviarNotificacionToBoleto = async (req, res = response) => {
  const uid = req.params.uid
  const payload = {
    ...req.body
  }
  try {
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
    const vapidKey = {
      "publicKey": process.env.PUBLICKEY,
      "privateKey": process.env.PRIVATEDKEY
    }
    webpush.setVapidDetails(
      'mailto:info@cochisweb.com',
      vapidKey.publicKey,
      vapidKey.privateKey
    );
    var ressPush = []
    var ressError = []
    if (boletoDB.pushNotification.length > 0) {
      boletoDB.pushNotification.forEach(async element => {
        const pushDB = await Push.findById(element._id)
        if (!pushDB) {
          return res.status(400).json({
            ok: false, message: 'No se encontro push'
          })
        }

        let ps = {
          endpoint: pushDB.endpoint,
          expirationTime: null,
          keys: pushDB.keys
        }

        // console.log('webpush', webpush.setVapidDetails)
        // console.log('ps', ps)
        // console.log('payload', payload)
        webpush.sendNotification(ps, JSON.stringify(payload)).then(resPush => {



          ressPush.push(resPush)
        }).catch(err => {

          ressError.push(err)

        })
      });
      return await res.status(200).json({
        ok: true,
        res: ressPush,
        resError: ressError
      })
    } else {
      return await res.status(200).json({
        ok: false,
        message: 'Favor de pedir que acepten las notificaciones en sus dispositivos'
      })

    }




  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: error,
    })
  }



  /* try {
    const tokenPushDB = await TokenPush.findById(uid)
    if (!tokenPushDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tokenPush',
      })
    }
    res.json({
      ok: true,
      tokenPush: tokenPushDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  } */
}



module.exports = {
  getTokenPushs,
  getAllTokenPushs,
  crearTokenPush,
  actualizarTokenPush,
  isActive,
  getTokenPushById,
  enviarNotificacion,
  enviarNotificacionToUser,
  enviarNotificacionToBoleto

}
