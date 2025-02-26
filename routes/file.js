/*
Ruta : api/files
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getFiles,

  getAllFiles,

} = require("../controllers/file");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/:type/:envi", validarJWT, getFiles);

module.exports = router;
