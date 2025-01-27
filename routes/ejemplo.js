/*
Ruta : api/ejemplos
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getEjemplos,
  crearEjemplo,
  actualizarEjemplo,
  isActive,
  getEjemploById,
  getAllEjemplos,
  getEjemplosByEmail
} = require("../controllers/ejemplo");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", getEjemplos);
router.get("/all", getAllEjemplos);
router.get("/:uid", getEjemploById);
router.get("/email/:email", getEjemplosByEmail);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("urlFiestaBoleto").not().isEmpty(),
    check("fiesta").not().isEmpty(),
    check("tipo").not().isEmpty(),
    check("recomendacion").not().isEmpty(),
    validarCampos,
  ],
  crearEjemplo
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("urlFiestaBoleto").not().isEmpty(),
    check("fiesta").not().isEmpty(),
    check("tipo").not().isEmpty(),
    check("recomendacion").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarEjemplo
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
