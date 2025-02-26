const { response } = require('express')
const bcrypt = require('bcryptjs')
const Fiesta = require('../models/fiesta')
const Galeria = require('../models/galeria')
const Invitacion = require('../models/invitacion')
const Item = require('../models/item')
const Paquete = require('../models/paquete')
const Proveedor = require('../models/proveedor')
const Salon = require('../models/salon')
const Usuario = require('../models/usuario')
const fs = require('fs')
const JSZip = require('jszip');
const zip = new JSZip();
const path = require('path')
//getFiles File
const getFiles = async (req, res) => {

  const type = req.params.type
  const envi = req.params.envi

  const dir = `./uploads/${type}`
  var filesTypes = []
  var borrar = []
  var borrados = []
  try {
    const [files, total] = await Promise.all([
      fs.readdirSync(dir),
      fs.readdirSync(dir).length,

    ])
    if (envi == 'dev') {
      url = 'http://localhost:3008/api/upload/zips/'
    } else {
      url = 'https://www.myticketparty.com/api/upload/zips/'

    }
    const date = new Date()
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;



    switch (type) {

      case 'fiestas':
        const fiestasDB = await Fiesta.find({})
        fiestasDB.forEach(async el => {
          await filesTypes.push(el.img)
        });
        break;
      case 'galerias':
        const galeriasDB = await Galeria.find({})
        galeriasDB.forEach(async el => {
          await filesTypes.push(el.img)
        });
        break;
      case 'invitaciones':
        const invitacionsDB = await Invitacion.find({})
        invitacionsDB.forEach(async el => {
          if (el.data.img1 && el.data.img1 != '') {

            await filesTypes.push(el.data.img1)
          }
          if (el.data.mensajeImg && el.data.mensajeImg != '') {

            await filesTypes.push(el.data.mensajeImg)
          }
          if (el.data.donde1Img && el.data.donde1Img != '') {

            await filesTypes.push(el.data.donde1Img)
          }
          if (el.data.donde2Img && el.data.donde2Img != '') {

            await filesTypes.push(el.data.donde2Img)
          }
          if (el.data.donde3Img && el.data.donde3Img != '') {

            await filesTypes.push(el.data.donde3Img)
          }
          if (el.data.hospedajeImg && el.data.hospedajeImg != '') {

            await filesTypes.push(el.data.hospedajeImg)
          }
          if (el.data.mesaRegalosImg && el.data.mesaRegalosImg != '') {

            await filesTypes.push(el.data.mesaRegalosImg)
          }
          if (el.data.byFileInvitacion && el.data.byFileInvitacion != '') {

            await filesTypes.push(el.data.byFileInvitacion)
          }
        });
        break;

      case 'items':
        const itemsDB = await Item.find({})
        itemsDB.forEach(async el => {

          itemsDB.forEach(el => {
            el.photos.forEach(async ph => {

              await filesTypes.push(ph.img)
            });

          });


        });
        break;
      case 'musica':


        const InvitacionDBMusica = await Invitacion.find({})
        InvitacionDBMusica.forEach(async el => {

          if (el.data.musicaInvitacion && el.data.musicaInvitacion != '') {

            await filesTypes.push(el.data.musicaInvitacion)
          }
        });
        break;

      case 'paquetes':
        const paqueteDB = await Paquete.find({})
        paqueteDB.forEach(async el => {
          await filesTypes.push(el.img)
        });
        break;
      case 'proveedores':
        const proveedorDB = await Proveedor.find({})
        proveedorDB.forEach(async el => {
          await filesTypes.push(el.img)
        });
        break;
      case 'salones':
        const salonesDB = await Salon.find({})
        salonesDB.forEach(async el => {
          await filesTypes.push(el.img)
        });
        break;
      case 'usuarios':
        const usuariosDB = await Usuario.find({})
        usuariosDB.forEach(async el => {
          await filesTypes.push(el.img)
        });
        break;

      default:
        break;

    }
    files.forEach(async (imgFile, i) => {

      if (!filesTypes.includes(imgFile)) {
        await borrar.push(dir + '/' + imgFile)
      }
    });









    files.forEach(async (imgFile, i) => {

      if (!filesTypes.includes(imgFile)) {
        await borrar.push(dir + '/' + imgFile)
      }
    });

    var images = []
    borrar.forEach(br => {

      let file;
      file = br
      images.push(file)
    });



    const img = zip.folder("");
    for (const image of images) {
      const imageData = fs.readFileSync(image);
      img.file(image, imageData);

    }


    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .pipe(fs.createWriteStream(`./uploads/zips/${type}-borrados-${currentDate}.zip`))
      .on('finish', async function () {


        const pathZIP = await path.join(__dirname, `../uploads/zips/${type}-borrados-${currentDate}.zip`)


        borrar.forEach(br => {
          if (borrarArchivo(br)) {
            borrarArchivo(br)
            borrados.push(br)
          }
        });

        res.json({
          ok: true,
          files,
          totalFiles: total,
          filesTypes,
          totalFiles: filesTypes.length,
          borrar,
          cantidadABorrar: borrar.length,
          borrados,
          cantidadBorrados: borrados.length,
          ok: true,
          url: `${url}${type}-borrados-${currentDate}.zip`

        })




      });


    /*   */






  } catch (error) {
    console.error('error::: ', error);

  }

}



const borrarArchivo = (path) => {
  try {
    if (fs.existsSync(path)) {

      fs.unlinkSync(path)

    } else {
      return true
    }
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })

  }
}



module.exports = {
  getFiles


}
