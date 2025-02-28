/*
Ruta : api/tipoContactos
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getTipoContactos,
  crearTipoContacto,
  actualizarTipoContacto,
  isActive,
  getTipoContactoById,
  getAllTipoContactos,
  getTipoContactosByEmail
} = require("../controllers/tipoContacto");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getTipoContactos);
router.get("/all", getAllTipoContactos);
router.get("/:uid", validarJWT, getTipoContactoById);
router.get("/email/:email", validarJWT, getTipoContactosByEmail);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("icon", "El icon es obligatorio").not().isEmpty(),

    validarCampos,
  ],
  crearTipoContacto
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("icon", "El icon es obligatorio").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarTipoContacto
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
