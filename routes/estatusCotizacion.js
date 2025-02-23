/*
Ruta : api/estatusCotizaciones
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getEstatusCotizaciones,
  crearEstatusCotizacion,
  actualizarEstatusCotizacion,
  isActive,
  getEstatusCotizacionById,
  getAllEstatusCotizaciones,
  getEstatusCotizacionesByEmail,
  getEstatusCotizacionesByStep
} = require("../controllers/estatusCotizacion");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getEstatusCotizaciones);
router.get("/all", validarJWT, getAllEstatusCotizaciones);
router.get("/:uid", validarJWT, getEstatusCotizacionById);
router.get("/email/:email", validarJWT, getEstatusCotizacionesByEmail);
router.get("/step/:step", validarJWT, getEstatusCotizacionesByStep);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),
    check("step", "La step es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearEstatusCotizacion
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligarotira").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarEstatusCotizacion
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
