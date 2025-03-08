const { response } = require('express')
const bcrypt = require('bcryptjs')
const Fiesta = require('../models/fiesta')
const { generarJWT } = require('../helpers/jwt')
const Cron = require('../models/cron')
//getFiestas Fiesta
const getFiestas = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [fiestas, total] = await Promise.all([
    Fiesta.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('evento')
      .populate('salon')
      .populate('usuarioFiesta', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Fiesta.countDocuments(),
  ])

  res.json({
    ok: true,
    fiestas,
    uid: req.uid,
    total,
  })
}
const getAllFiestas = async (req, res) => {
  const [fiestas, total] = await Promise.all([
    Fiesta.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('evento')
      .populate('salon')
      .populate('usuarioFiesta', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ fecha: -1 }),
    Fiesta.countDocuments(),
  ])

  res.json({
    ok: true,
    fiestas,
    uid: req.uid,
    total,
  })
}

//crearFiesta Fiesta
const crearFiesta = async (req, res = response) => {

  const uid = req.uid

  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }
  try {
    const fiesta = new Fiesta({
      ...campos
    })

    await fiesta.save()


    res.json({
      ok: true,
      fiesta
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarFiesta Fiesta
const actualizarFiesta = async (req, res = response) => {
  //Validar token y comporbar si es el sfiesta
  const uid = req.params.id
  try {
    const fiestaDB = await Fiesta.findById(uid)
    if (!fiestaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un fiesta',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!fiestaDB.google) {
      campos.email = email
    } else if (fiestaDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El fiesta de Google  no se puede actualizar',
      })
    }


    const fiestaActualizado = await Fiesta.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      fiestaActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const actualizarFiestaByUsr = async (req, res = response) => {
  //Validar token y comporbar si es el sfiesta
  const uid = req.params.id
  try {
    const fiestaDB = await Fiesta.findById(uid)
    if (!fiestaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un fiesta',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!fiestaDB.google) {
      campos.email = email
    } else if (fiestaDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El fiesta de Google  no se puede actualizar',
      })
    }


    const fiestaActualizado = await Fiesta.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      fiestaActualizado,
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
    const fiestaDB = await Fiesta.findById(uid)
    if (!fiestaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un fiesta',
      })
    }
    const campos = req.body
    campos.activated = !fiestaDB.activated
    const fiestaActualizado = await Fiesta.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      fiestaActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getFiestaById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const fiestaDB = await Fiesta.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('evento')
      .populate('salon')
      .populate('usuarioFiesta', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('salon')
    if (!fiestaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un fiesta',
      })
    }
    res.json({
      ok: true,
      fiesta: fiestaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getFiestaByEmail = async (req, res = response) => {
  const email = req.params.email


  try {
    const fiestaDB = await Fiesta.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('evento')
      .populate('salon')
      .populate('usuarioFiesta', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('salon')
      ;

    if (!fiestaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exiten fiestas',
      })
    }

    res.json({
      ok: true,
      fiestas: fiestaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getFiestasByAnfitrion = async (req, res = response) => {
  const uid = req.params.uid



  try {
    const fiestaDB = await Fiesta.find({ usuarioFiesta: uid })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('evento')
      .populate('salon')
      .populate('usuarioFiesta', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!fiestaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exiten fiestas',
      })
    }

    res.json({
      ok: true,
      fiestas: fiestaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const deleteFiestasByUser = async (req, res = response) => {
  const user = req.params.user


  try {


    const fiestaDB = await Fiesta.deleteMany({ $or: [{ userCreated: user }, { usuarioFiesta: user }] })
    if (!fiestaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exiten fiestas',
      })
    }

    res.json({
      ok: true,
      usuario: user,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getFiestasBySalon = async (req, res = response) => {
  const uid = req.params.uid


  try {
    const fiestaDB = await Fiesta.find({ salon: uid })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('evento')
      .populate('salon')
      .populate('usuarioFiesta', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!fiestaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exiten fiestas',
      })
    }

    res.json({
      ok: true,
      fiestas: fiestaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const changeStatus = async (req, res = response) => {

  let today = new Date().getTime() + 604800000
  var desactivadas = []
  try {
    const fiestaDB = await Fiesta.find()
    var fiestaDB1 = await fiestaDB.filter((res, j) => {

      return res.fecha <= today
    })

    if (fiestaDB1 && fiestaDB1.length > 0) {
      await fiestaDB1.forEach(async (fs, i) => {
        fiestaDB1[i].activated = false
        let id = fiestaDB1[i]._id.toString()
        campos = {
          nombre: fiestaDB1[i].nombre,
          evento: fiestaDB1[i].evento.toString(),
          cantidad: fiestaDB1[i].cantidad,
          fecha: fiestaDB1[i].fecha,
          calle: fiestaDB1[i].calle,
          numeroInt: fiestaDB1[i].numeroInt,
          numeroExt: fiestaDB1[i].numeroExt,
          municipioDelegacion: fiestaDB1[i].municipioDelegacion,
          coloniaBarrio: fiestaDB1[i].coloniaBarrio,
          cp: fiestaDB1[i].cp,
          estado: fiestaDB1[i].estado,
          pais: fiestaDB1[i].pais,
          comoLlegar: fiestaDB1[i].comoLlegar,
          lat: fiestaDB1[i].lat,
          long: fiestaDB1[i].long,
          usuarioFiesta: fiestaDB1[i].usuarioFiesta.toString(),
          salon: fiestaDB1[i].salon.toString(),
          img: fiestaDB1[i].img,
          invitacion: fiestaDB1[i].invitacion,
          activacreadated: fiestaDB1[i].activacreadated,
          realizada: fiestaDB1[i].realizada,
          galeria: fiestaDB1[i].galeria,
          checking: fiestaDB1[i].checking,
          mesaOk: fiestaDB1[i].mesaOk,
          example: fiestaDB1[i].example,
          croquis: fiestaDB1[i].croquis,
          croquisOk: fiestaDB1[i].croquisOk,
          usuarioCreated: fiestaDB1[i].usuarioCreated.toString(),
          activated: false,
          dateCreated: fiestaDB1[i].dateCreated,
          lastEdited: today,
        }
        var fiestaActualizado = await Fiesta.findByIdAndUpdate(id, campos, {
          new: true,
        })
        await desactivadas.push(fiestaActualizado)
      });
    }
    const cron = await new Cron({
      type: 'Desactivacion fiestas',
      response: fiestaDB1,
      dataCreated: today,
    })
    await cron.save()
    if (desactivadas.length == 0) {
      return res.status(200).json({
        ok: false,
        msg: 'Sin fiestas por actualizar',
        cron: cron
      })
    }
    res.json({
      ok: true,
      fiestasDesactivadas: desactivadas,
      cron: cron
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error,
      msg: 'Error inesperado',
    })
  }
}



module.exports = {
  getFiestas,
  crearFiesta,
  actualizarFiesta,
  isActive,
  getFiestaById,
  getAllFiestas,
  getFiestaByEmail,
  getFiestasByAnfitrion,
  getFiestasBySalon,
  actualizarFiestaByUsr,
  changeStatus

}
