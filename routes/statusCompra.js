/*
Ruta : api/statusCompras
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getStatusCompras,
  crearStatusCompra,
  actualizarStatusCompra,
  isActive,
  getStatusCompraById,
  getAllStatusCompras,
  getStatusComprasByEmail,
  getStatusCompraByClave,
  getStatusCompraByStep
} = require("../controllers/statusCompra");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getStatusCompras);
router.get("/all", validarJWT, getAllStatusCompras);
router.get("/:uid", validarJWT, getStatusCompraById);
router.get("/clave/:clave", validarJWT, getStatusCompraByClave);
router.get("/step/:step", validarJWT, getStatusCompraByStep);
router.get("/email/:email", validarJWT, getStatusComprasByEmail);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearStatusCompra
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
  actualizarStatusCompra
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
