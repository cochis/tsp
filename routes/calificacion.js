/*
Ruta : api/calificaciones
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getCalificaciones,
  crearCalificacion,
  actualizarCalificacion,
  isActive,
  getCalificacionById,
  getAllCalificaciones,
  getCalificacionesByEmail,
  getCalificacionByCotizacion
} = require("../controllers/calificacion");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getCalificaciones);
router.get("/all", validarJWT, getAllCalificaciones);
router.get("/:uid", getCalificacionById);
router.get("/cotizacion/:uid", getCalificacionByCotizacion);
router.get("/email/:email", validarJWT, getCalificacionesByEmail);
router.post(
  "/",
  [


    validarCampos,
  ],
  crearCalificacion
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
  actualizarCalificacion
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
