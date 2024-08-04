/*
Ruta : api/moduloTemplates
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getModuloTemplates,
  crearModuloTemplate,
  actualizarModuloTemplate,
  isActive,
  getModuloTemplateById,
  getAllModuloTemplates,
  getModuloTemplateForSln,
  getModuloTemplateByClave
} = require("../controllers/moduloTemplate");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getModuloTemplates);
router.get("/all", getAllModuloTemplates);
router.get("/all/salon", getModuloTemplateForSln);
router.get("/:uid", getModuloTemplateById);
router.get("/clave/:clave", getModuloTemplateByClave);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("diseno", "El diseno es obligatorio").not().isEmpty(),
    check("css", "El css es obligatorio").not().isEmpty(),
    check("tipoModulo", "El tipo de modulo es obligatorio").not().isEmpty(),


    validarCampos,
  ],
  crearModuloTemplate
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("diseno", "El diseno es obligatorio").not().isEmpty(),
    check("css", "El css es obligatorio").not().isEmpty(),
    check("tipoModulo", "El tipo de modulo es obligatorio").not().isEmpty(),
    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarModuloTemplate
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
