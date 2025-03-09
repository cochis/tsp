/*
Ruta : api/mailTemplates
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getMailTemplates,
  crearMailTemplate,
  actualizarMailTemplate,
  isActive,
  getMailTemplateById,
  getAllMailTemplates,
  getMailTemplatesByEmail
} = require("../controllers/mailTemplate");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getMailTemplates);
router.get("/all", validarJWT, getAllMailTemplates);
router.get("/:uid", validarJWT, getMailTemplateById);
router.get("/email/:email", validarJWT, getMailTemplatesByEmail);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearMailTemplate
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
  actualizarMailTemplate
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
