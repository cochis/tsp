const { response } = require('express')
const bcrypt = require('bcryptjs')
const Boleto = require('../models/boleto')
const { generarJWT } = require('../helpers/jwt')
//getBoletos Boleto
const getBoletos = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [boletos, total] = await Promise.all([
    Boleto.find({})
      .sort({ nombre: 1 })
      .populate('fiesta', 'nombre,tipoEvento,cantidad,fecha,lugar,img,usuarioCreated,realizada,')
      .skip(desde)
      .limit(cant),
    Boleto.countDocuments(),
  ])

  res.json({
    ok: true,
    boletos,
    uid: req.uid,
    total,
  })
}
const getAllBoletos = async (req, res) => {
  const [boletos, total] = await Promise.all([
    Boleto.find({})


      .populate({
        path: 'fiesta',
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { path: 'salon' }
      })
      .sort({ nombre: 1 }),
    Boleto.countDocuments(),
  ])

  res.json({
    ok: true,
    boletos,
    uid: req.uid,
    total,
  })
}

//crearBoleto Boleto
const crearBoleto = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  try {


    const boleto = new Boleto({
      ...campos
    })


    await boleto.save()

    res.json({
      ok: true,
      boleto
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}
//crearBoleto Boleto
const dropBoletos = async (req, res = response) => {



  try {

    Boleto.deleteMany({})


    res.json({
      delete: true,

    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarBoleto Boleto
const actualizarBoleto = async (req, res = response) => {
  //Validar token y comporbar si es el sboleto
  const uid = req.params.id

  try {
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!boletoDB.google) {
      campos.email = email
    } else if (boletoDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El boleto de Google  no se puede actualizar',
      })
    }


    const boletoActualizado = await Boleto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      boletoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const setPushBoleto = async (req, res = response) => {
  //Validar token y comporbar si es el sboleto
  const uid = req.params.id

  try {
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    let bl = {
      ...boletoDB,
      pushNotification: req.body.pushNotification

    }

    const boletoActualizado = await Boleto.findByIdAndUpdate(uid, bl, {
      new: true,
    })
    res.json({
      ok: true,
      boletoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const registrarAsistencia = async (req, res = response) => {
  //Validar token y comporbar si es el sboleto
  const uid = req.params.id

  try {
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    const { ...campos } = req.body

    const boletoActualizado = await Boleto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      boletoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const confirmaBoleto = async (req, res = response) => {
  //Validar token y comporbar si es el sboleto
  const uid = req.params.id
  try {
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!boletoDB.google) {
      campos.email = email
    } else if (boletoDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El boleto de Google  no se puede actualizar',
      })
    }


    const boletoActualizado = await Boleto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      boletoActualizado,
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
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    const campos = req.body
    campos.activated = !boletoDB.activated
    const boletoActualizado = await Boleto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      boletoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const isVista = async (req, res = response) => {
  const uid = req.params.id
  try {
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }

    boletoDB.vista = true
    const boletoActualizado = await Boleto.findByIdAndUpdate(uid, boletoDB, {
      new: true,
    })
    res.json({
      ok: true,
      boletoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}
const cambiarBoletos = async (req, res = response) => {
  const uid = req.params.id
  try {
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    const boletoActualizado = await Boleto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      boletoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getBoletoById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    res.json({
      ok: true,
      boleto: boletoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getBoletoByFiesta = async (req, res = response) => {
  const uid = req.params.uid


  try {
    const boletoDB = await Boleto.find({ fiesta: uid })


    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    res.json({
      ok: true,
      boleto: boletoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}


const getBoletosByEmail = async (req, res = response) => {
  const email = req.params.email


  try {
    const boletoDB = await Boleto.find({ usuarioCreated: email })

      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('fiesta')
      .populate({
        path: 'fiesta',
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { path: 'usuarioFiesta' }
      })
      .populate({
        path: 'fiesta',
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { path: 'salon' }
      })
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un salon',
      })
    }
    res.json({
      ok: true,
      boletos: boletoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}



const setPushNotificationBoleto = async (req, res = response) => {
  //Validar token y comporbar si es el sboleto
  const uid = req.params.id

  try {
    const boletoDB = await Boleto.findById(uid)
    if (!boletoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un boleto',
      })
    }
    const { ...campos } = req.body

    const boletoActualizado = await Boleto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      boletoActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}




module.exports = {
  getBoletos,
  crearBoleto,
  actualizarBoleto,
  isActive,
  getBoletoById,
  getAllBoletos,
  getBoletoByFiesta,
  confirmaBoleto,
  registrarAsistencia,
  getBoletosByEmail,
  setPushNotificationBoleto,
  isVista,
  setPushBoleto,
  cambiarBoletos,
  dropBoletos

}
