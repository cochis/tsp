const { response } = require('express')
const bcrypt = require('bcryptjs')
const Role = require('../models/role')
const { generarJWT } = require('../helpers/jwt')
//getRoles Role
const getRoles = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [roles, total] = await Promise.all([
      Role.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      Role.countDocuments(),
    ])

    res.json({
      ok: true,
      roles,
      uid: req.uid,
      total,
    })
  } catch (error) {
    console.error('error::: ', error);
    res.json({
      ok: false,
      error
    })
  }
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [roles, total] = await Promise.all([
    Role.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Role.countDocuments(),
  ])

  res.json({
    ok: true,
    roles,
    uid: req.uid,
    total,
  })
}
const getAllRoles = async (req, res) => {

  try {
    const [roles, total] = await Promise.all([
      Role.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      Role.countDocuments(),
    ])


    res.json({
      ok: true,
      roles,
      uid: req.uid,
      total,
    })
  } catch (error) {
    console.error('error::: ', error);
    res.json({
      ok: false,
      error
    })

  }

}

//crearRole Role
const crearRole = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }

  try {


    const role = new Role({
      ...campos
    })


    await role.save()


    res.json({
      ok: true,
      role
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarRole Role
const actualizarRole = async (req, res = response) => {
  //Validar token y comporbar si es el srole
  const uid = req.params.id
  try {
    const roleDB = await Role.findById(uid)
    if (!roleDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un role',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!roleDB.google) {
      campos.email = email
    } else if (roleDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El role de Google  no se puede actualizar',
      })
    }


    const roleActualizado = await Role.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      roleActualizado,
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
    const roleDB = await Role.findById(uid)
    if (!roleDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un role',
      })
    }
    const campos = req.body
    campos.activated = !roleDB.activated
    const roleActualizado = await Role.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      roleActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getRoleById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const roleDB = await Role.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!roleDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un role',
      })
    }
    res.json({
      ok: true,
      role: roleDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getRoleByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const roleDB = await Role.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!roleDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un role',
      })
    }
    res.json({
      ok: true,
      role: roleDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getRoleForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const roleDB = await Role.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!roleDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un role',
      })
    }
    res.json({
      ok: true,
      roles: roleDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}



module.exports = {
  getRoles,
  crearRole,
  actualizarRole,
  isActive,
  getRoleById,
  getAllRoles,
  getRoleForSln,
  getRoleByClave
}
