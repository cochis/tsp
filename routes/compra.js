/*
Ruta : api/compras
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getCompras,
  crearCompra,
  actualizarCompra,
  isActive,
  getCompraById,
  getAllCompras,
  getComprasByEmail
} = require("../controllers/compra");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getCompras);
router.get("/all", validarJWT, getAllCompras);
router.get("/:uid", validarJWT, getCompraById);
router.get("/email/:email", validarJWT, getComprasByEmail);
router.post(
  "/",
  [
    validarJWT,
    check("usuario", "El usuario es obligatorio").not().isEmpty(),
    check("status", "El status es obligatorio").not().isEmpty(),
    check("paquetes", "Los paquetes son obligatorios").not().isEmpty(),
    check("costo", "El costo es obligatorio").not().isEmpty(),
    check("iva", "El iva es obligatorio").not().isEmpty(),


    validarCampos,
  ],
  crearCompra
);

router.put(
  "/:id",
  [
    validarJWT,
    check("usuario", "El usuario es obligatorio").not().isEmpty(),
    check("status", "El status es obligatorio").not().isEmpty(),
    check("paquete", "El paquete es obligatorio").not().isEmpty(),
    check("costo", "El costo es obligatorio").not().isEmpty(),
    check("iva", "El iva es obligatorio").not().isEmpty(),
    check("cantidadFiestas", "La cantidadFiestas es obligatoria").not().isEmpty(),
    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarCompra
);


router.put(
  "/isActive/:id",
  [
    validarJWT,
    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  isActive
);


module.exports = router;
