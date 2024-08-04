/*
Ruta : api/tipoModulos
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getTipoModulos,
  crearTipoModulo,
  actualizarTipoModulo,
  isActive,
  getTipoModuloById,
  getAllTipoModulos,
  getTipoModuloForSln,
  getTipoModuloByClave
} = require("../controllers/tipoModulo");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getTipoModulos);
router.get("/all", getAllTipoModulos);
router.get("/all/salon", getTipoModuloForSln);
router.get("/:uid", getTipoModuloById);
router.get("/clave/:clave", getTipoModuloByClave);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),
    check("values", "La value es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearTipoModulo
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
  actualizarTipoModulo
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
