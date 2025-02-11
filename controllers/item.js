const { response } = require('express')
const bcrypt = require('bcryptjs')
const Item = require('../models/item')
const { generarJWT } = require('../helpers/jwt')
//getItems Item
const getItems = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [items, total] = await Promise.all([
    Item.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('categoriaItem')
      .populate('proveedor')
      .skip(desde)
      .limit(cant),
    Item.countDocuments(),
  ])

  res.json({
    ok: true,
    items,
    uid: req.uid,
    total,
  })
}
const getAllItems = async (req, res) => {
  const [items, total] = await Promise.all([
    Item.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('categoriaItem')
      .populate('proveedor')

      .sort({ nombre: 1 }),
    Item.countDocuments(),
  ])

  res.json({
    ok: true,
    items,
    uid: req.uid,
    total,
  })
}

//crearItem Item
const crearItem = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const item = new Item({
      ...campos
    })


    await item.save()


    res.json({
      ok: true,
      item
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarItem Item
const actualizarItem = async (req, res = response) => {
  //Validar token y comporbar si es el sitem
  const uid = req.params.id
  try {
    const itemDB = await Item.findById(uid)
    if (!itemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un item',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!itemDB.google) {
      campos.email = email
    } else if (itemDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El item de Google  no se puede actualizar',
      })
    }


    const itemActualizado = await Item.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      itemActualizado,
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
    const itemDB = await Item.findById(uid)
    if (!itemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un item',
      })
    }
    const campos = req.body
    campos.activated = !itemDB.activated
    const itemActualizado = await Item.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      itemActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getItemById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const itemDB = await Item.findById(uid)
      .populate('categoriaItem')
      .populate('proveedor')
    if (!itemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un item',
      })
    }
    res.json({
      ok: true,
      item: itemDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getItemsByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const itemDB = await Item.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('categoriaItem')
      .populate('proveedor')

    if (!itemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      items: itemDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getItemsByProveedor = async (req, res = response) => {
  const proveedor = req.params.proveedor



  try {
    const itemDB = await Item.find({ proveedor: proveedor })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('categoriaItem')
      .populate('proveedor')

    if (!itemDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      items: itemDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getItems,
  crearItem,
  actualizarItem,
  isActive,
  getItemById,
  getAllItems,
  getItemsByEmail,
  getItemsByProveedor

}
