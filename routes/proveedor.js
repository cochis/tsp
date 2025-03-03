/*
Ruta : api/proveedors
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getProveedors,
  crearProveedor,
  actualizarProveedor,
  isActive,
  getProveedorById,
  getAllProveedors,
  getProveedorsByEmail,
  getProveedorsByCreador
} = require("../controllers/proveedor");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getProveedors);
router.get("/all", getAllProveedors);
router.get("/:uid", getProveedorById);
router.get("/email/:email", validarJWT, getProveedorsByEmail);
router.get("/creador/:id", validarJWT, getProveedorsByCreador);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearProveedor
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
  actualizarProveedor
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
