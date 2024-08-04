const { response } = require('express')
const bcrypt = require('bcryptjs')
const Compra = require('../models/compra')
const { generarJWT } = require('../helpers/jwt')
//getCompras Compra
const getCompras = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [compras, total] = await Promise.all([
    Compra.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Compra.countDocuments(),
  ])

  res.json({
    ok: true,
    compras,
    uid: req.uid,
    total,
  })
}
const getAllCompras = async (req, res) => {
  const [compras, total] = await Promise.all([
    Compra.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Compra.countDocuments(),
  ])

  res.json({
    ok: true,
    compras,
    uid: req.uid,
    total,
  })
}

//crearCompra Compra
const crearCompra = async (req, res = response) => {

  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }




  try {


    const compra = new Compra({
      ...campos
    })


    await compra.save()


    res.json({
      ok: true,
      compra
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarCompra Compra
const actualizarCompra = async (req, res = response) => {
  //Validar token y comporbar si es el scompra
  const uid = req.params.id
  try {
    const compraDB = await Compra.findById(uid)
    if (!compraDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un compra',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!compraDB.google) {
      campos.email = email
    } else if (compraDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El compra de Google  no se puede actualizar',
      })
    }


    const compraActualizado = await Compra.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      compraActualizado,
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
    const compraDB = await Compra.findById(uid)
    if (!compraDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un compra',
      })
    }
    const campos = req.body
    campos.activated = !compraDB.activated
    const compraActualizado = await Compra.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      compraActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getCompraById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const compraDB = await Compra.findById(uid)
    if (!compraDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un compra',
      })
    }
    res.json({
      ok: true,
      compra: compraDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getComprasByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const compraDB = await Compra.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!compraDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      compras: compraDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getCompras,
  crearCompra,
  actualizarCompra,
  isActive,
  getCompraById,
  getAllCompras,
  getComprasByEmail

}
