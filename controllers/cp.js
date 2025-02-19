const { response } = require('express')
const bcrypt = require('bcryptjs')
const Cp = require('../models/cp')
const { generarJWT } = require('../helpers/jwt')
//getCps Cp
const getCps = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [cps, total] = await Promise.all([
    Cp.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Cp.countDocuments(),
  ])

  res.json({
    ok: true,
    cps,
    uid: req.uid,
    total,
  })
}
const getAllCps = async (req, res) => {
  const [cps, total] = await Promise.all([
    Cp.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Cp.countDocuments(),
  ])

  res.json({
    ok: true,
    cps,
    uid: req.uid,
    total,
  })
}

//crearCp Cp
const crearCp = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const cp = new Cp({
      ...campos
    })


    await cp.save()


    res.json({
      ok: true,
      cp
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarCp Cp
const actualizarCp = async (req, res = response) => {
  //Validar token y comporbar si es el scp
  const uid = req.params.id
  try {
    const cpDB = await Cp.findById(uid)
    if (!cpDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un cp',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!cpDB.google) {
      campos.email = email
    } else if (cpDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El cp de Google  no se puede actualizar',
      })
    }


    const cpActualizado = await Cp.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      cpActualizado,
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
    const cpDB = await Cp.findById(uid)
    if (!cpDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un cp',
      })
    }
    const campos = req.body
    campos.activated = !cpDB.activated
    const cpActualizado = await Cp.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      cpActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getCpById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const cpDB = await Cp.findById(uid)
    if (!cpDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un cp',
      })
    }
    res.json({
      ok: true,
      cp: cpDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getCpsByEmail = async (req, res = response) => {
  const email = req.params.email



  try {
    const cpDB = await Cp.find({ usuarioCreated: email })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!cpDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      cps: cpDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getCpsByPaisCP = async (req, res = response) => {
  const cp = req.params.cp
  const pais = req.params.pais

  try {
    const cpDB = await Cp.find({ pais_clv: pais, d_codigo: cp })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!cpDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un cp',
      })
    }
    res.json({
      ok: true,
      cps: cpDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getCpsByCP = async (req, res = response) => {
  const cp = req.params.cp



  try {
    const cpDB = await Cp.find({ d_codigo: cp })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


    if (!cpDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un cp',
      })
    }
    res.json({
      ok: true,
      cps: cpDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}



const deleteCPS = async (req, res = response) => {

  try {
    const [total, del] = await Promise.all([

      Cp.countDocuments(),
      Cp.deleteMany({})
    ])


    if (del.deleteCount > 0) {

      return res.json({
        ok: true,
        msg: 'Borrados' + total
      })
    } else {
      return res.json({
        ok: true,
        msg: 'No se borro'
      })

    }


  } catch (error) {
    return res.json({
      ok: false,
      error: error
    })
  }



}










module.exports = {
  getCps,
  crearCp,
  actualizarCp,
  isActive,
  getCpById,
  getAllCps,
  getCpsByEmail,
  deleteCPS,
  getCpsByCP,
  getCpsByPaisCP

}
