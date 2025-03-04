/*
Ruta : api/tipoUbicaciones
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getTipoUbicaciones,
  crearTipoUbicacion,
  actualizarTipoUbicacion,
  isActive,
  getTipoUbicacionById,
  getAllTipoUbicaciones,
  getTipoUbicacionesByEmail
} = require("../controllers/tipoUbicacion");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getTipoUbicaciones);
router.get("/all", validarJWT, getAllTipoUbicaciones);
router.get("/:uid", validarJWT, getTipoUbicacionById);
router.get("/email/:email", validarJWT, getTipoUbicacionesByEmail);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearTipoUbicacion
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
  actualizarTipoUbicacion
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
