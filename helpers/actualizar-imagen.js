const fs = require('fs')
const Usuario = require('../models/usuario')
const Salon = require('../models/salon')
const Fiesta = require('../models/fiesta')
const Galeria = require('../models/galeria')
const Invitacion = require('../models/invitacion')
const Paquete = require('../models/paquete')

const borrarImagen = (path) => {

  try {

    if (fs.existsSync(path)) {
     
      fs.unlinkSync(path)

    } else {
      

    }
  } catch (error) {
    console.error('error::: ', error);

  }
}
const actualizarImagen = async (tipo, id, nombreArchivo) => {
  let pathViejo = ''
  switch (tipo) {
    case 'usuarios':
      const usuario = await Usuario.findById(id)
      if (!usuario) {
        return false
      }
      pathViejo = `./uploads/usuarios/${usuario.img}`
      if (usuario.img && usuario.img !== '') {
        borrarImagen(pathViejo)
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

        borrarImagen(pathViejo)
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

        borrarImagen(pathViejo)
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

        borrarImagen(pathViejo)
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

        borrarImagen(pathViejo)
      }
      paquete.img = nombreArchivo
      await paquete.save()
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
            borrarImagen(pathViejo)
          }
          invitacion.data.mensajeImg = nombreArchivo

          await invitacion.save()

          return true
          break;
        case 'img1':
          if (invitacion.data.img1 !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.img1}`
            borrarImagen(pathViejo)
          }
          invitacion.data.img1 = nombreArchivo

          await invitacion.save()

          return true
          break;
        case 'donde1Img':
          if (invitacion.data.donde1Img !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.donde1Img}`
            borrarImagen(pathViejo)
          }
          invitacion.data.donde1Img = nombreArchivo

          await invitacion.save()
        case 'donde2Img':
          if (invitacion.data.donde2Img !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.donde2Img}`
            borrarImagen(pathViejo)
          }
          invitacion.data.donde2Img = nombreArchivo

          await invitacion.save()

          return true
          break;
        case 'donde3Img':
          if (invitacion.data.donde3Img !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.donde3Img}`
            borrarImagen(pathViejo)
          }
          invitacion.data.donde3Img = nombreArchivo

          await invitacion.save()

          return true
          break;
        case 'hospedajeImg':
          if (invitacion.data.hospedajeImg !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.hospedajeImg}`
            borrarImagen(pathViejo)
          }
          invitacion.data.hospedajeImg = nombreArchivo

          await invitacion.save()

          return true
          break;
        case 'mesaRegalosImg':
          if (invitacion.data.mesaRegalosImg !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.mesaRegalosImg}`
            borrarImagen(pathViejo)
          }
          invitacion.data.mesaRegalosImg = nombreArchivo

          await invitacion.save()

          return true
          break;
        case 'byFileInvitacion':
          if (invitacion.data.byFileInvitacion !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.byFileInvitacion}`
            borrarImagen(pathViejo)
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
const actualizarImagenFiesta = async (tipo, id, nombreArchivo, type) => {
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
            borrarImagen(pathViejo)
          }
          fiesta.img = nombreArchivo

          await fiesta.save()

          return true
          break;
        case 'croquis':
          if (fiesta.croquis !== '') {
            pathViejo = `./uploads/fiestas/${fiesta.croquis}`
            borrarImagen(pathViejo)
          }
          fiesta.croquis = nombreArchivo

          await fiesta.save()

          return true
          break;

          if (invitacion.data.byFileInvitacion !== '') {
            pathViejo = `./uploads/invitaciones/${invitacion.data.byFileInvitacion}`
            borrarImagen(pathViejo)
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

module.exports = {
  actualizarImagen,
  actualizarImagenTemplate,
  actualizarImagenFiesta
}
