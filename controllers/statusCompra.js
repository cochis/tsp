const { response } = require('express')
const bcrypt = require('bcryptjs')
const StatusCompra = require('../models/statusCompra')
const { generarJWT } = require('../helpers/jwt')
//getStatusCompras StatusCompra
const getStatusCompras = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [statusCompras, total] = await Promise.all([
    StatusCompra.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    StatusCompra.countDocuments(),
  ])

  res.json({
    ok: true,
    statusCompras,
    uid: req.uid,
    total,
  })
}
const getAllStatusCompras = async (req, res) => {
  const [statusCompras, total] = await Promise.all([
    StatusCompra.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ step: 1 }),
    StatusCompra.countDocuments(),
  ])

  res.json({
    ok: true,
    statusCompras,
    uid: req.uid,
    total,
  })
}

//crearStatusCompra StatusCompra
const crearStatusCompra = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const statusCompra = new StatusCompra({
      ...campos
    })


    await statusCompra.save()


    res.json({
      ok: true,
      statusCompra
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarStatusCompra StatusCompra
const actualizarStatusCompra = async (req, res = response) => {
  //Validar token y comporbar si es el sstatusCompra
  const uid = req.params.id
  try {
    const statusCompraDB = await StatusCompra.findById(uid)
    if (!statusCompraDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un statusCompra',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!statusCompraDB.google) {
      campos.email = email
    } else if (statusCompraDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El statusCompra de Google  no se puede actualizar',
      })
    }


    const statusCompraActualizado = await StatusCompra.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      statusCompraActualizado,
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
    const statusCompraDB = await StatusCompra.findById(uid)
    if (!statusCompraDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un statusCompra',
      })
    }
    const campos = req.body
    campos.activated = !statusCompraDB.activated
    const statusCompraActualizado = await StatusCompra.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      statusCompraActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getStatusCompraById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const statusCompraDB = await StatusCompra.findById(uid)
    if (!statusCompraDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un statusCompra',
      })
    }
    res.json({
      ok: true,
      statusCompra: statusCompraDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getStatusCompraByClave = async (req, res = response) => {
  const clave = req.params.clave


  try {
    const statusCompraDB = await StatusCompra.find({ clave: clave })

    if (!statusCompraDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un statusCompra',
      })
    }
    res.json({
      ok: true,
      statusCompra: statusCompraDB[0],
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getStatusCompraByStep = async (req, res = response) => {
  const step = req.params.step



  try {
    const statusCompraDB = await StatusCompra.find({ step: step })
    if (!statusCompraDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un statusCompra',
      })
    }
    res.json({
      ok: true,
      statusCompra: statusCompraDB[0],
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}




const getStatusComprasByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const statusCompraDB = await StatusCompra.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!statusCompraDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      statusCompras: statusCompraDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getStatusCompras,
  crearStatusCompra,
  actualizarStatusCompra,
  isActive,
  getStatusCompraById,
  getAllStatusCompras,
  getStatusComprasByEmail,
  getStatusCompraByClave,
  getStatusCompraByStep


}
