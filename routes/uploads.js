/*
Ruta : api/uploads/:busqueda
*/

const { Router } = require('express')
const expressFileUpload = require('express-fileupload')

const { validarJWT } = require('../middlewares/validar-jwt')

const { fileUpload, retornaImagen, fileUploadGaleria, fileUploadTemplate, deleteGaleria } = require('../controllers/uploads')
const router = Router()

router.use(expressFileUpload())
router.put('/:tipo/:id', fileUpload)
router.put('/:tipo/:id/:imgTemplate', fileUploadTemplate)
router.get('/:tipo/:foto', retornaImagen)
router.get('/:fiesta/:boleto', fileUploadGaleria)
router.patch('/remove/:tipo/:foto', deleteGaleria)

module.exports = router
