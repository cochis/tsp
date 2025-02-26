/*
Ruta : api/datas
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  delDataByUsr
} = require("../controllers/data");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/:id", validarJWT, delDataByUsr);

module.exports = router;
