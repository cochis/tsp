/*
Ruta : api/paquetes
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getPaquetes,
  crearPaquete,
  actualizarPaquete,
  isActive,
  getPaqueteById,
  getAllPaquetes,
  getPaquetesByEmail,
  getPaqueteByClave
} = require("../controllers/paquete");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getPaquetes);
router.get("/all", getAllPaquetes);
router.get("/:uid", getPaqueteById);
router.get("/clave/:clave", getPaqueteByClave);
router.get("/email/:email", getPaquetesByEmail);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearPaquete
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
  actualizarPaquete
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
