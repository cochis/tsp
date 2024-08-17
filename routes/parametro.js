/*
Ruta : api/parametros
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getParametros,
  crearParametro,
  actualizarParametro,
  isActive,
  getParametroById,
  getAllParametros,
  getParametrosByEmail,
  getParametrosByClave
} = require("../controllers/parametro");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getParametros);
router.get("/all", validarJWT, getAllParametros);
router.get("/:uid", validarJWT, getParametroById);
router.get("/email/:email", validarJWT, getParametrosByEmail);
router.get("/clave/:clave", getParametrosByClave);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearParametro
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
  actualizarParametro
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
