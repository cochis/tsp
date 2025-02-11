/*
Ruta : api/tipoColors
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getTipoColors,
  crearTipoColor,
  actualizarTipoColor,
  isActive,
  getTipoColorById,
  getAllTipoColors,
  getTipoColorsByEmail
} = require("../controllers/tipoColor");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getTipoColors);
router.get("/all", validarJWT, getAllTipoColors);
router.get("/:uid", validarJWT, getTipoColorById);
router.get("/email/:email", validarJWT, getTipoColorsByEmail);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),
    check("value", "El valor es obligatorio").not().isEmpty(),

    validarCampos,
  ],
  crearTipoColor
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligarotira").not().isEmpty(),
    check("value", "El valor es obligatorio").not().isEmpty(),
    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarTipoColor
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
