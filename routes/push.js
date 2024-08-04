/*
Ruta : api/pushs
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getPushs,
  crearPush,
  actualizarPush,
  isActive,
  getPushById,
  getAllPushs,
  getPushForSln,
  getPushByClave
} = require("../controllers/push");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getPushs);
router.get("/all", getAllPushs);
router.get("/all/salon", getPushForSln);
router.get("/:uid", getPushById);
router.get("/clave/:clave", getPushByClave);
router.post(
  "/",
  [ 
    check("endpoint", "El endpoint es obligatorio").not().isEmpty(),
    check("keys", "Las keys son obligatorias").not().isEmpty(),

    validarCampos,
  ],
  crearPush
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
  actualizarPush
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
