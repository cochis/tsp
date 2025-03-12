const { response } = require('express')
const bcrypt = require('bcryptjs')
const Cp = require('../models/cp')
const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/jwt')
const fs = require('fs');
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
const getCpsByPaisEdo = async (req, res = response) => {
  const pais = req.params.pais
  const edo = req.params.edo

  try {
    const cpDB = await Cp.find({ pais_clv: pais, d_estado: edo })
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
const readFile = async (req, res = response) => {
  const pais = req.params.pais
  const number = req.params.number
  try {
    fs.readFile(`./uploads/files/cpsMx${number}.json`, 'utf8', async (error, datos) => {
      if (error) {
        console.error("Ocurrió un error al leer el archivo:", error);
        return res.json({
          ok: false,
          error: error
        })
      }
      const usuarioDB = await Usuario.find({ email: 'info@cochisweb.com' })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .populate('role')
        .populate('tipoCentro', 'nombre clave _id')
        .populate('salon')



      var codigos = []
      datos = JSON.parse(datos)

      datos.forEach(async cp => {
        let codigo = {
          ...cp,
          usuarioCreated: usuarioDB[0]._id,
          dateCreated: Date.now(),
          lastEdited: Date.now(),
          pais_clv: pais
        }
        codigos.push(codigo)
        let cpN = new Cp({
          ...codigo
        })
        await cpN.save()






      });


      return res.json({
        ok: true,
        datos: codigos
      })
    });

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
  getCpsByPaisCP,
  readFile,
  getCpsByPaisEdo

}
