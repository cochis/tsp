const { response } = require('express')
const path = require('path')
const bcrypt = require('bcryptjs')
const Galeria = require('../models/galeria')
const { generarJWT } = require('../helpers/jwt')
const stat = require("fs").statSync;
const fs = require("fs");
const AdmZip = require("adm-zip");
const JSZip = require("jszip");
//getGalerias Galeria
const getGalerias = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [galerias, total] = await Promise.all([
    Galeria.find({})
      .sort({ dateCreated: 1 })
      .populate('fiesta')
      .populate('boleto')

      .skip(desde)
      .limit(cant),
    Galeria.countDocuments(),
  ])

  res.json({
    ok: true,
    galerias,
    uid: req.uid,
    total,
  })
}
const getAllGalerias = async (req, res) => {
  const [galerias, total] = await Promise.all([
    Galeria.find({})
      .populate('fiesta')
      .populate('boleto')
      .sort({ nombre: 1 }),
    Galeria.countDocuments(),
  ])

  res.json({
    ok: true,
    galerias,
    uid: req.uid,
    total,
  })
}
const getGaleriasBoleto = async (req, res) => {
  const boleto = req.params.boleto
  const [galerias, total] = await Promise.all([
    Galeria.find({ boleto: boleto })
      .sort({ dateCreated: 1 })
      .populate('fiesta')
      .populate('boleto')
    ,
    Galeria.countDocuments(),
  ])

  res.json({
    ok: true,
    galerias,
    uid: req.uid,
    total: galerias.length,
  })
}
const getGaleriasFiesta = async (req, res) => {
  const fiesta = req.params.fiesta
  const [galerias, total] = await Promise.all([
    Galeria.find({ fiesta: fiesta })
      .sort({ dateCreated: 1 })
      .populate('fiesta')
      .populate('boleto')
    ,
    Galeria.countDocuments(),
  ])

  res.json({
    ok: true,
    galerias,
    uid: req.uid,
    total,
  })
}
const downloadGaleriasFiesta = async (req, res = response) => {
  const fiesta = req.params.fiesta
  var url = req.params.url

  if (url == 'false') {
    url = 'http://localhost:3008/api/upload/zips/'
  } else {
    url = 'https://tickets.cochisweb.com/api/upload/zips/'

  }

  const galerias = await Galeria.find({ fiesta: fiesta, activated: true })
  const JSZip = require('jszip');
  const fs = require('fs');

  const zip = new JSZip();

  try {
    var images = []
    galerias.forEach(gal => {
      let file;
      file = './uploads/galerias/' + gal.img
      images.push(file)
    });
    const img = zip.folder("");
    for (const image of images) {
      const imageData = fs.readFileSync(image);
      img.file(image, imageData);
    }
    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .pipe(fs.createWriteStream('./uploads/zips/' + fiesta + '.zip'))
      .on('finish', function () {


        const pathZIP = path.join(__dirname, `../uploads/zips/${fiesta}.zip`)
        if (fs.existsSync(pathZIP)) {
          res.status(200).json({
            ok: true,
            url: `${url}${fiesta}.zip`
          })
        } else {
          res.status(200).json({
            ok: false,
            msg: 'Algo salio mal intente mas tarde'
          })
        }
      });

  } catch (err) {
    // console.error(err)
  }

  /* 
    var zp = []
    galerias.forEach(gal => {
       // console.log('gal::: ', gal);
      let file;
      file = img.file('http://localhost:3008/api/upload/galerias/' + gal.img, imgData, { base64: true });
  
      zp.push(file)
    });
  
    zip.generateAsync({ type: "blob" }).then(function (content) {
     
      saveAs(content, "example.zip");
    }); */

}

//crearGaleria Galeria
const crearGaleria = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }
  try {


    const galeria = new Galeria({
      ...campos
    })


    await galeria.save()


    res.json({
      ok: true,
      galeria
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}

//actualizarGaleria Galeria
const actualizarGaleria = async (req, res = response) => {
  //Validar token y comporbar si es el sgaleria
  const uid = req.params.id
  try {
    const galeriaDB = await Galeria.findById(uid)
    if (!galeriaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un galeria',
      })
    }
    const { ...campos } = req.body



    const galeriaActualizado = await Galeria.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      galeriaActualizado,
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
    const galeriaDB = await Galeria.findById(uid)
    if (!galeriaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un galeria',
      })
    }
    const campos = req.body
    campos.activated = !galeriaDB.activated
    const galeriaActualizado = await Galeria.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      galeriaActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getGaleriaById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const galeriaDB = await Galeria.findById(uid)
    if (!galeriaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un galeria',
      })
    }
    res.json({
      ok: true,
      galeria: galeriaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getGaleriaByEmail = async (req, res = response) => {
  const email = req.params.email

  try {
    const galeriaDB = await Galeria.find({ email: email })
      .sort({ dateCreated: 1 })
      .populate('fiesta')
      .populate('boleto')

    if (!galeriaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un galeria',
      })
    }
    res.json({
      ok: true,
      galerias: galeriaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
const getGaleriaByCreador = async (req, res = response) => {
  const uid = req.params.uid

  try {
    const galeriaDB = await Galeria.find({ usuarioCreated: uid })
      .sort({ dateCreated: 1 })
      .populate('fiesta')
      .populate('boleto')

    if (!galeriaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un galeria',
      })
    }
    res.json({
      ok: true,
      galerias: galeriaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getGalerias,
  crearGaleria,
  actualizarGaleria,
  isActive,
  getGaleriaById,
  getAllGalerias,
  getGaleriaByEmail,
  getGaleriaByCreador,
  getGaleriasBoleto,
  getGaleriasFiesta,
  downloadGaleriasFiesta

}
