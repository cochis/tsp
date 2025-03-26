const path = require('path')
const fs = require('fs')
const { response } = require('express')
const { v4: uuidv4 } = require('uuid')
const Galeria = require('../models/galeria')
const Fiesta = require('../models/fiesta')
const { actualizarImagen, actualizarImagenTemplate, actualizarImagenType, actualizarMusicaInvitacion, actualizarImagenProveedor } = require('../helpers/actualizar-imagen')
const fileUpload = async (req, res = response) => {
  const tipo = req.params.tipo

  const id = req.params.id

  const tiposValidos = [
    'usuarios',
    'fiestas',
    'salones',
    'galerias',
    'paquetes',
    'imgItems',
    'items',
    'fondos'
  ]

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      msg: 'No es valido el archivo',
    })
  }
  //validar si existe un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: 'No se envío ningún archivo',
    })
  }
  const file = await req.files.imagen
  const nombreCortado = file.name.split('.')
  const extensionArchivo = nombreCortado[nombreCortado.length - 1]
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`
  const path = `./uploads/${tipo}/${nombreArchivo}`

  file.mv(path, async (err) => {
    if (err) {
      console.error('err', err)
      return res.status(500).json({
        ok: false,
        msg: 'Error al subir la imagen',
      })
    }
    await actualizarImagen(tipo, id, nombreArchivo)
    return await res.status(200).json({
      ok: true,
      msg: 'Archivo subido',
      nombreArchivo,
    })
  })
}
const fileUploadTemplate = async (req, res = response) => {
  const tipo = req.params.tipo
  const id = req.params.id
  const imgTemplate = req.params.imgTemplate
  const tiposValidos = [
    'invitaciones'
  ]
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      msg: 'No es valido el archivo',
    })
  }
  //validar si existe un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: 'No se envío ningún archivo',
    })
  }
  const file = await req.files.imagen
  const nombreCortado = file.name.split('.')
  const extensionArchivo = nombreCortado[nombreCortado.length - 1]
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`
  const path = `./uploads/${tipo}/${nombreArchivo}`
  file.mv(path, async (err) => {
    if (err) {
      console.error('err', err)
      return res.status(500).json({
        ok: false,
        msg: 'Error al subir la imagen',
      })
    }
    await actualizarImagenTemplate(tipo, id, nombreArchivo, imgTemplate)
    return await res.status(200).json({
      ok: true,
      msg: 'Archivo subido',
      nombreArchivo,
    })
  })
}
const fileUploadFiestas = async (req, res = response) => {
  const type = req.params.type
  const id = req.params.id
  //validar si existe un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: 'No se envío ningún archivo',
    })
  }
  const file = await req.files.imagen
  const nombreCortado = file.name.split('.')
  const extensionArchivo = nombreCortado[nombreCortado.length - 1]
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`
  const path = `./uploads/fiestas/${nombreArchivo}`
  file.mv(path, async (err) => {
    if (err) {
      console.error('err', err)
      return res.status(500).json({
        ok: false,
        msg: 'Error al subir la imagen',
      })
    }
    await actualizarImagenType('fiestas', id, nombreArchivo, type)
    return await res.status(200).json({
      ok: true,
      msg: 'Archivo  subido',
      nombreArchivo,
    })
  })
}
const fileUploadItems = async (req, res = response) => {
  const type = req.params.type
  const id = req.params.id

  //validar si existe un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: 'No se envío ningún archivo',
    })
  }
  const file = await req.files.imagen
  const nombreCortado = file.name.split('.')
  const extensionArchivo = nombreCortado[nombreCortado.length - 1]
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`
  const path = `./uploads/items/${nombreArchivo}`
  file.mv(path, async (err) => {
    if (err) {
      console.error('err', err)
      return res.status(500).json({
        ok: false,
        msg: 'Error al subir la imagen',
      })
    }
    await actualizarImagenType('items', id, nombreArchivo, type)
    return await res.status(200).json({
      ok: true,
      msg: 'Archivo  subido',
      nombreArchivo,
    })
  })
}
const fileUploadProveedor = async (req, res = response) => {
  const type = req.params.type

  const id = req.params.id

  //validar si existe un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: 'No se envío ningún archivo',
    })
  }
  const file = await req.files.imagen
  const nombreCortado = file.name.split('.')
  const extensionArchivo = nombreCortado[nombreCortado.length - 1]
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`
  const path = `./uploads/proveedores/${nombreArchivo}`
  file.mv(path, async (err) => {
    if (err) {
      console.error('err', err)
      return res.status(500).json({
        ok: false,
        msg: 'Error al subir la imagen',
      })
    }
    await actualizarImagenProveedor('proveedor', id, nombreArchivo, type)
    return await res.status(200).json({
      ok: true,
      msg: 'Archivo  subido',
      nombreArchivo,
    })
  })
}

const fileUploadGaleria = async (req, res = response) => {
  const fiesta = req.params.fiesta
  const boleto = req.params.boleto
  //validar si existe un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: 'No se envío ningún archivo',
    })
  }
  const file = await req.files.imagen
  const nombreCortado = file.name.split('.')
  const extensionArchivo = nombreCortado[nombreCortado.length - 1]
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`
  const path = `./uploads/${tipo}/${nombreArchivo}`
  file.mv(path, async (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        msg: 'Error al subir la imagen',
      })
    }
    await actualizarImagen(tipo, id, nombreArchivo)
    return await res.status(200).json({
      ok: true,
      msg: 'Archivo subido',
      nombreArchivo,
    })
  })
}
const deleteGaleria = async (req, res = response) => {
  const tipo = req.params.tipo

  const foto = req.params.foto

  try {
    const galeriaDB = await Galeria.findById(foto)
    if (!galeriaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe la foto',
      })
    }
    const path = `./uploads/${tipo}/${galeriaDB.img}`

    let glDB = {
      fiesta: galeriaDB.fiesta.toString(),
      boleto: galeriaDB.boleto.toString(),
      img: '',
      dateCreated: galeriaDB.dateCreated,
      activated: false,
      lastEdited: Date.now()
    }
    if (fs.existsSync(path)) {
      fs.unlinkSync(path)
      const galeriaActualizada = await Galeria.findByIdAndUpdate(galeriaDB._id.toString(), glDB, {
        new: true,
      })
      return await res.status(200).json({
        ok: true,
        msg: 'Archivo borrado',
      })
    } else {
      return await res.status(400).json({
        ok: false,
        msg: 'Error al borrar foto',
        foto,
      })
    }
  } catch (error) {
    return await res.status(400).json({
      ok: false,
      msg: 'Error al borrar foto',
      error,
    })
  }
}
const deleteAllGaleria = async (req, res = response) => {
  const fiesta = req.params.fiesta
  const boleto = req.params.boleto
  //validar si existe un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: 'No se envío ningún archivo',
    })
  }
  const file = await req.files.imagen
  const nombreCortado = file.name.split('.')
  const extensionArchivo = nombreCortado[nombreCortado.length - 1]
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`
  const path = `./uploads/${tipo}/${nombreArchivo}`
  file.mv(path, async (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        msg: 'Error al subir la imagen',
      })
    }
    await actualizarImagen(tipo, id, nombreArchivo)
    return await res.status(200).json({
      ok: true,
      msg: 'Archivo subido',
      nombreArchivo,
    })
  })
}
const retornaImagen = (req, res = response) => {
  const tipo = req.params.tipo
  const foto = req.params.foto
  const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`)

  if (fs.existsSync(pathImg) && foto != '') {
    res.sendFile(pathImg)
  } else {
    const noFound = path.join(__dirname, `../uploads/notImage.png`)
    res.sendFile(noFound)
  }
}
const retornaMusica = (req, res = response) => {
  const sound = req.params.sound
  const pathSound = path.join(__dirname, `../uploads/musica/${sound}`)
  if (fs.existsSync(pathSound) && sound != '') {
    res.sendFile(pathSound)
  } else {
    return false
  }
}
const fileUploadMusicaIinvitacion = async (req, res = response) => {
  const id = req.params.id
  //validar si existe un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: 'No se envío ningún archivo',
    })
  }
  const file = await req.files.sound
  const nombreCortado = file.name.split('.')
  const extensionArchivo = nombreCortado[nombreCortado.length - 1]
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`
  const path = `./uploads/musica/${nombreArchivo}`
  file.mv(path, async (err) => {
    if (err) {
      console.error('err', err)
      return res.status(500).json({
        ok: false,
        msg: 'Error al subir la imagen',
      })
    }
    await actualizarMusicaInvitacion(id, nombreArchivo)
    return await res.status(200).json({
      ok: true,
      msg: 'Archivo  subido',
      nombreArchivo,
    })
  })
}


const deleteFile = async (req, res = response) => {
  const tipo = req.params.tipo
  const file = req.params.file
  const type = req.params.type
  try {
    const path = `./uploads/${tipo}/${file}`
    if (fs.existsSync(path)) {
      fs.unlinkSync(path)

      return await res.status(200).json({
        ok: true,
        type: type,
        tipo: tipo,
        file: file,
        msg: 'Archivo borrado',
      })
    } else {
      return await res.status(200).json({
        ok: false,
        type: type,
        tipo: tipo,
        file: file,
        msg: 'No se encontro file',
        file,
      })
    }

  } catch (error) {
    return await res.status(400).json({
      ok: false,
      msg: 'Error al borrar file',
      error,
    })
  }
}



module.exports = {
  fileUpload,
  retornaImagen,
  fileUploadTemplate,
  fileUploadGaleria,
  deleteGaleria,
  fileUploadFiestas,
  fileUploadItems,
  fileUploadMusicaIinvitacion,
  retornaMusica,
  fileUploadProveedor,
  deleteFile
}