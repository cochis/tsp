/*
Ruta : api/stripes
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  checkout,
  checkSession
} = require("../controllers/stripe");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.post(
  "/",
  [
    validarJWT,
    check("items", "los items son obligatorios").not().isEmpty(),
    check("url_success", "La url_success es obligatoria").not().isEmpty(),
    check("url_cancel", "La url_cancel es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  checkout
);
router.get("/:ev/:session_id", checkSession);


module.exports = router;
