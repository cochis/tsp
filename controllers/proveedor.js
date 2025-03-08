const { response } = require('express')
const bcrypt = require('bcryptjs')
const Proveedor = require('../models/proveedor')
const { generarJWT } = require('../helpers/jwt')
//getProveedors Proveedor
const getProveedors = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [proveedors, total] = await Promise.all([
    Proveedor.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')

      .skip(desde)
      .limit(cant),
    Proveedor.countDocuments(),
  ])

  res.json({
    ok: true,
    proveedors,
    uid: req.uid,
    total,
  })
}
const getAllProveedors = async (req, res) => {
  const [proveedors, total] = await Promise.all([
    Proveedor.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')

      .sort({ nombre: 1 }),
    Proveedor.countDocuments(),
  ])

  res.json({
    ok: true,
    proveedors,
    uid: req.uid,
    total,
  })
}

//crearProveedor Proveedor
const crearProveedor = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const proveedor = new Proveedor({
      ...campos
    })


    await proveedor.save()


    res.json({
      ok: true,
      proveedor
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarProveedor Proveedor
const actualizarProveedor = async (req, res = response) => {
  //Validar token y comporbar si es el sproveedor
  const uid = req.params.id
  try {
    const proveedorDB = await Proveedor.findById(uid)
    if (!proveedorDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedor',
      })
    }
    const { password, google, email, ...campos } = req.body
    console.log('campos::: ', campos);
    if (!proveedorDB.google) {
      campos.email = email
    } else if (proveedorDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El proveedor de Google  no se puede actualizar',
      })
    }


    const proveedorActualizado = await Proveedor.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      proveedorActualizado,
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
    const proveedorDB = await Proveedor.findById(uid)
    if (!proveedorDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedor',
      })
    }
    const campos = req.body
    campos.activated = !proveedorDB.activated
    const proveedorActualizado = await Proveedor.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      proveedorActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getProveedorById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const proveedorDB = await Proveedor.findById(uid)
    if (!proveedorDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedor',
      })
    }
    res.json({
      ok: true,
      proveedor: proveedorDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getProveedorsByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const proveedorDB = await Proveedor.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!proveedorDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      proveedors: proveedorDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getProveedorsByCreador = async (req, res = response) => {
  const id = req.params.id



  try {
    const proveedorDB = await Proveedor.find({ usuarioCreated: id })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!proveedorDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      proveedors: proveedorDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getProveedors,
  crearProveedor,
  actualizarProveedor,
  isActive,
  getProveedorById,
  getAllProveedors,
  getProveedorsByEmail,
  getProveedorsByCreador

}
