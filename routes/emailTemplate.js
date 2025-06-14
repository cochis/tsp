/*
Ruta : api/emailTemplates
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getEmailTemplates,
  crearEmailTemplate,
  actualizarEmailTemplate,
  isActive,
  getEmailTemplateById,
  getAllEmailTemplates,
  getEmailTemplatesByEmail
} = require("../controllers/emailTemplate");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getEmailTemplates);
router.get("/all", validarJWT, getAllEmailTemplates);
router.get("/:uid", validarJWT, getEmailTemplateById);
router.get("/email/:email", validarJWT, getEmailTemplatesByEmail);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearEmailTemplate
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
  actualizarEmailTemplate
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
