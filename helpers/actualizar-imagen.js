const fs = require('fs')
const Usuario = require('../models/usuario')
const Salon = require('../models/salon')
const Fiesta = require('../models/fiesta')
const Proveedor = require('../models/proveedor')
const Galeria = require('../models/galeria')
const Invitacion = require('../models/invitacion')
const Paquete = require('../models/paquete')
const Item = require('../models/item')
const ImgItem = require('../models/imgItem')

const borrarArchivo = (path) => {
  try {
    if (fs.existsSync(path)) {

      fs.unlinkSync(path)
    } else {
      console.log('no borro');
    }
  } catch (error) {
    console.error('error::: ', error);

  }
}
const actualizarImagen = async (tipo, id, nombreArchivo) => {

  switch (tipo) {
    case 'usuarios':
      const usuario = await Usuario.findById(id)
      if (!usuario) {
        return false
      }
      pathViejo = `./uploads/usuarios/${usuario.img}`
      if (usuario.img && usuario.img !== '') {
        borrarArchivo(pathViejo)
      }
      usuario.img = nombreArchivo
      await usuario.save()
      return true
      break
    case 'fiestas':
      const fiesta = await Fiesta.findById(id)
      if (!fiesta) {
        return false
      }
      pathViejo = `./uploads/fiestas/${fiesta.img}`
      if (fiesta.img && fiesta.img !== '') {

        borrarArchivo(pathViejo)
      }
      fiesta.img = nombreArchivo
      await fiesta.save()
      return true
      break
    case 'salones':
      const salon = await Salon.findById(id)
      if (!salon) {
        return false
      }
      pathViejo = `./uploads/salones/${salon.img}`
      if (salon.img && salon.img !== '') {

        borrarArchivo(pathViejo)
      }
      salon.img = nombreArchivo
      await salon.save()
      return true
      break
    case 'galerias':
      const galeria = await Galeria.findById(id)
      if (!galeria) {
        return false
      }
      pathViejo = `./uploads/galerias/${galeria.img}`
      if (galeria.img && galeria.img !== '') {

        borrarArchivo(pathViejo)
      }
      galeria.img = nombreArchivo
      await galeria.save()
      return true
      break
    case 'paquetes':
      const paquete = await Paquete.findById(id)
      if (!paquete) {
        return false
      }
      pathViejo = `./uploads/paquetes/${paquete.img}`
      if (paquete.img && paquete.img !== '') {

        borrarArchivo(pathViejo)
      }
      paquete.img = nombreArchivo
      await paquete.save()
      return true
    case 'items':
      const item = await Item.findById(id)
      if (!item) {
        return false
      }

      switch (type) {
        case 'img':
          if (fiesta.img !== '') {
            pathViejo = `./uploads/fiestas/${fiesta.img}`
            borrarArchivo(pathViejo)
          }
          fiesta.img = nombreArchivo

          await fiesta.save()

          return true
          break;
        case 'croquis':
          if (fiesta.croquis !== '') {
            pathViejo = `./uploads/fiestas/${fiesta.croquis}`
            borrarArchivo(pathViejo)
          }
          fiesta.croquis = nombreArchivo

          await fiesta.save()

          return true
          break;

          if (invitacion.data.byFileInvitacion !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.byFileInvitacion}`
            borrarArchivo(pathViejo)
          }
          invitacion.data.byFileInvitacion = nombreArchivo

          await invitacion.save()

          return true
          break;

        default:
          break;
      }











      pathViejo = `./uploads/items/${item.img}`
      if (item.img && item.img !== '') {

        borrarArchivo(pathViejo)
      }
      item.img = nombreArchivo
      await item.save()
      return true
      break
    case 'imgItems':

      const imgItem = await ImgItem.findById(id)
      if (!imgItem) {
        return false
      }
      pathViejo = `./uploads/imgItems/${imgItem.img}`

      if (imgItem.img && imgItem.img !== '') {

        borrarArchivo(pathViejo)
      }
      imgItem.img = nombreArchivo
      await imgItem.save()
      return true
      break
    default:
      break
  }
}
const actualizarImagenTemplate = async (tipo, id, nombreArchivo, imgTemplate) => {

  let pathViejo = ''
  switch (tipo) {
    case 'invitaciones':
      var invitacion = await Invitacion.findOne({ fiesta: id })

      if (!invitacion) {
        return false
      }

      switch (imgTemplate) {
        case 'mensajeImg':
          if (invitacion.data.mensajeImg !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.mensajeImg}`
            borrarArchivo(pathViejo)
          }
          invitacion.data.mensajeImg = nombreArchivo

          await invitacion.save()

          return true
          break;
        case 'img1':
          if (invitacion.data.img1 !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.img1}`
            borrarArchivo(pathViejo)
          }
          invitacion.data.img1 = nombreArchivo

          await invitacion.save()

          return true
          break;
        case 'donde1Img':
          if (invitacion.data.donde1Img !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.donde1Img}`
            borrarArchivo(pathViejo)
          }
          invitacion.data.donde1Img = nombreArchivo

          await invitacion.save()
        case 'donde2Img':
          if (invitacion.data.donde2Img !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.donde2Img}`
            borrarArchivo(pathViejo)
          }
          invitacion.data.donde2Img = nombreArchivo

          await invitacion.save()

          return true
          break;
        case 'donde3Img':
          if (invitacion.data.donde3Img !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.donde3Img}`
            borrarArchivo(pathViejo)
          }
          invitacion.data.donde3Img = nombreArchivo

          await invitacion.save()

          return true
          break;
        case 'hospedajeImg':
          if (invitacion.data.hospedajeImg !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.hospedajeImg}`
            borrarArchivo(pathViejo)
          }
          invitacion.data.hospedajeImg = nombreArchivo

          await invitacion.save()

          return true
          break;
        case 'mesaRegalosImg':
          if (invitacion.data.mesaRegalosImg !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.mesaRegalosImg}`
            borrarArchivo(pathViejo)
          }
          invitacion.data.mesaRegalosImg = nombreArchivo

          await invitacion.save()

          return true
          break;
        case 'byFileInvitacion':
          if (invitacion.data.byFileInvitacion !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.byFileInvitacion}`
            borrarArchivo(pathViejo)
          }
          invitacion.data.byFileInvitacion = nombreArchivo

          await invitacion.save()

          return true
          break;

        default:
          break;
      }

    default:
      break
  }
}
const actualizarImagenType = async (tipo, id, nombreArchivo, type) => {

  let pathViejo = ''
  switch (tipo) {
    case 'fiestas':
      var fiesta = await Fiesta.findById(id)
      if (!fiesta) {
        return false
      }
      switch (type) {
        case 'img':
          if (fiesta.img !== '') {
            pathViejo = `./uploads/fiestas/${fiesta.img}`
            borrarArchivo(pathViejo)
          }
          fiesta.img = nombreArchivo

          await fiesta.save()

          return true
          break;
        case 'croquis':
          if (fiesta.croquis !== '') {
            pathViejo = `./uploads/fiestas/${fiesta.croquis}`
            borrarArchivo(pathViejo)
          }
          fiesta.croquis = nombreArchivo

          await fiesta.save()

          return true
          break;

          if (invitacion.data.byFileInvitacion !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.byFileInvitacion}`
            borrarArchivo(pathViejo)
          }
          invitacion.data.byFileInvitacion = nombreArchivo

          await invitacion.save()

          return true
          break;

        default:
          break;
      }
    case 'items':
      var item = await Item.findById(id)
      if (!item) {
        return false
      }

      item.photos.forEach(async (photo, id) => {
        if (id == Number(type)) {
          pathViejo = `./uploads/items/${photo.img}`
          borrarArchivo(pathViejo)
          item.photos[type].img = nombreArchivo

        }
      });
      if (item.photos[type]) {
        await item.save()

      }



    default:
      break
  }
}
const actualizarImagenProveedor = async (tipo, id, nombreArchivo, type) => {
  let pathViejo = ''
  switch (tipo) {
    case 'proveedor':
      var proveedor = await Proveedor.findById(id)
      if (!proveedor) {
        return false
      }
      switch (type) {
        case 'img':
          if (proveedor.img !== '') {
            pathViejo = `./uploads/proveedores/${proveedor.img}`
            borrarArchivo(pathViejo)
          }
          proveedor.img = nombreArchivo

          await proveedor.save()

          return true
          break;
        case 'bannerImg':
          if (proveedor.bannerImg !== '') {
            pathViejo = `./uploads/proveedores/${proveedor.bannerImg}`
            borrarArchivo(pathViejo)
          }
          proveedor.bannerImg = nombreArchivo

          await proveedor.save()

          return true
          break;

        default:
          break;
      }

    default:
      break
  }
}
const actualizarMusicaInvitacion = async (id, nombreArchivo) => {

  let pathViejo = ''
  var invitacion = await Invitacion.find({ fiesta: id })
  var invi = invitacion[0]


  if (!invitacion) {
    return false
  }
  pathViejo = `./uploads/musica/${invitacion[0].data.musicaInvitacion}`

  borrarArchivo(pathViejo)
  invi.data.musicaInvitacion = nombreArchivo


  await invi.save()

  return true
}

module.exports = {
  actualizarImagen,
  actualizarImagenTemplate,
  actualizarImagenType,
  actualizarMusicaInvitacion,
  actualizarImagenProveedor
}
