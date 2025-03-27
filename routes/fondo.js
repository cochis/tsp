/*
Ruta : api/fondos
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getFondos,
  crearFondo,
  actualizarFondo,
  isActive,
  getFondoById,
  getAllFondos,
  getFondosByEmail
} = require("../controllers/fondo");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getFondos);
router.get("/all", getAllFondos);
router.get("/:uid", getFondoById);
router.get("/email/:email", validarJWT, getFondosByEmail);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("tipo", "La tipo es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearFondo
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("tipo", "La tipo es obligarotira").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarFondo
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
