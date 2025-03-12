/*
Ruta : api/datas
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  delDataByUsr
} = require("../controllers/data");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/:id", validarAdminJWT, delDataByUsr);

module.exports = router;
