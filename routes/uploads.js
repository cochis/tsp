/*
Ruta : api/uploads/:busqueda
*/

const { Router } = require('express')
const expressFileUpload = require('express-fileupload')

const { validarJWT } = require('../middlewares/validar-jwt')

const { fileUpload, retornaImagen, fileUploadGaleria, fileUploadTemplate, deleteGaleria, fileUploadFiestas, fileUploadMusicaIinvitacion, retornaMusica, fileUploadProveedor, fileUploadItems, deleteFile } = require('../controllers/uploads')
const router = Router()

router.use(expressFileUpload())
router.put('/musica/:id', fileUploadMusicaIinvitacion)
router.get('/sound/:sound', retornaMusica)
router.put('/:tipo/:id', fileUpload)
router.put('/:tipo/fiestas/:type/:id', fileUploadFiestas)
router.put('/:tipo/items/:type/:id', fileUploadItems)
router.put('/:tipo/proveedor/:type/:id', fileUploadProveedor)
router.put('/:tipo/:id/:imgTemplate', fileUploadTemplate)
router.get('/:tipo/:foto', retornaImagen)
router.get('/:fiesta/:boleto', fileUploadGaleria)
router.patch('/remove/galerias/:foto', deleteGaleria)
router.patch('/remove/:type/:tipo/:file', deleteFile)
module.exports = router
