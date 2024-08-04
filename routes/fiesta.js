/*
Ruta : api/fiestas
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getFiestas,
  crearFiesta,
  actualizarFiesta,
  isActive,
  getFiestaById,
  getAllFiestas,
  getFiestaByEmail,
  getFiestasByAnfitrion,
  getFiestasBySalon,
  actualizarFiestaByUsr
} = require("../controllers/fiesta");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getFiestas);
router.get("/all", validarJWT, getAllFiestas);
router.get("/email/:email", validarJWT, getFiestaByEmail);
router.get("/anfitrion/:uid", validarJWT, getFiestasByAnfitrion);
router.get("/salon/:uid", validarJWT, getFiestasBySalon);
router.get("/:uid", getFiestaById);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("evento", "El tipo de evento es obligatorio").not().isEmpty(),

    check("fecha", "La fecha es obligatoria").not().isEmpty(),



    validarCampos,
  ],
  crearFiesta
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("evento", "El tipo de evento es obligatorio").not().isEmpty(),

    check("fecha", "La fecha es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  actualizarFiesta
);
router.put(
  "/usuario/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarFiestaByUsr
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
