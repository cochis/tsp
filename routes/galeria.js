/*
Ruta : api/galerias
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getGalerias,
  crearGaleria,
  actualizarGaleria,
  isActive,
  getGaleriaById,
  getAllGalerias,
  getGaleriaByEmail,
  getGaleriaByCreador,
  getGaleriasBoleto,
  getGaleriasFiesta,
  downloadGaleriasFiesta
} = require("../controllers/galeria");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", getGalerias);
router.get("/all", getAllGalerias);
router.get("/:uid", getGaleriaById);
router.get("/email/:email", getGaleriaByEmail);
router.get("/boleto/:boleto", getGaleriasBoleto);
router.get("/fiesta/:fiesta", getGaleriasFiesta);
router.get("/down-fiesta/:fiesta/:url", downloadGaleriasFiesta);
router.get("/creador/:uid", getGaleriaByCreador);
router.post(
  "/",
  [


    check("fiesta", "La fiesta es obligatoria").not().isEmpty(),



    validarCampos,
  ],
  crearGaleria
);

router.put(
  "/:id",
  [


    check("direccion", "La direccion es obligatoria").not().isEmpty(),
    check("telefono", "El telefono es obligatorio").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarGaleria
);


router.put(
  "/isActive/:id",
  [
    validarJWT, check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  isActive
);


module.exports = router;
