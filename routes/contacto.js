/*
Ruta : api/contactos
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getContactos,
  crearContacto,
  actualizarContacto,
  isActive,
  getContactoById,
  getAllContactos,
  getContactoForSln,
  getContactoByClave,
  sendContact
} = require("../controllers/contacto");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getContactos);
router.post("/sendContacto", sendContact);
router.get("/all", getAllContactos);
router.get("/all/salon", getContactoForSln);
router.get("/:uid", getContactoById);
router.get("/clave/:clave", getContactoByClave);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearContacto
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
  actualizarContacto
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
