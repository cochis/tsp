/*
Ruta : api/tipoCentros
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getTipoCentros,
  crearTipoCentro,
  actualizarTipoCentro,
  isActive,
  getTipoCentroById,
  getAllTipoCentros,
  getTipoCentroForSln,
  getTipoCentroByClave
} = require("../controllers/tipoCentro");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getTipoCentros);
router.get("/all", getAllTipoCentros);
router.get("/all/salon", getTipoCentroForSln);
router.get("/:uid", getTipoCentroById);
router.get("/clave/:clave", getTipoCentroByClave);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearTipoCentro
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
  actualizarTipoCentro
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
