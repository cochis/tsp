/*
Ruta : api/search/:busqueda
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { getTodo, getDocumentosColeccion, getDocumentosColeccionCatalogo } = require("../controllers/busquedas");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/:busqueda", validarJWT, getTodo);
router.get(
  "/coleccion/:tabla/:busqueda/:admin?",
  validarJWT,
  getDocumentosColeccion
);
router.get(
  "/coleccion-catalogo/:tabla/:busqueda/:admin?",
  validarJWT,
  getDocumentosColeccionCatalogo
);

module.exports = router;
