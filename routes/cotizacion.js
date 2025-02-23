/*
Ruta : api/cotizaciones
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getCotizaciones,
  crearCotizacion,
  actualizarCotizacion,
  isActive,
  getCotizacionById,
  getAllCotizaciones,
  getCotizacionesByEmail,
  getCotizacionesByProveedor,
  getCotizacionesByCreador
} = require("../controllers/cotizacion");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getCotizaciones);
router.get("/all", validarJWT, getAllCotizaciones);
router.get("/:uid", getCotizacionById);
router.get("/email/:email", validarJWT, getCotizacionesByEmail);
router.get("/proveedor/:id", validarJWT, getCotizacionesByProveedor);
router.get("/creador/:id", validarJWT, getCotizacionesByCreador);
router.post(
  "/",
  [
    validarJWT,


    validarCampos,
  ],
  crearCotizacion
);

router.put(
  "/:id",
  [
    validarJWT,


    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarCotizacion
);


router.put(
  "/isActive/:id",
  [

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  isActive
);


module.exports = router;
