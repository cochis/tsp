/*
Ruta : api/templates
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getTemplates,
  crearTemplate,
  actualizarTemplate,
  isActive,
  getTemplateById,
  getAllTemplates,
  getTemplateForSln,
  getTemplateByClave
} = require("../controllers/template");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getTemplates);
router.get("/all", getAllTemplates);
router.get("/all/salon", getTemplateForSln);
router.get("/:uid", getTemplateById);
router.get("/clave/:clave", getTemplateByClave);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearTemplate
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
  actualizarTemplate
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
