/*
Ruta : api/salons
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getSalons,
  crearSalon,
  actualizarSalon,
  isActive,
  getSalonById,
  getAllSalons,
  getSalonByEmail,
  getSalonByCreador,
  deleteSalonByUser
} = require("../controllers/salon");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getSalons);
router.get("/all", validarJWT, getAllSalons);
router.get("/:uid", validarJWT, getSalonById);
router.get("/email/:email", validarJWT, getSalonByEmail);
router.get("/creador/:uid", validarJWT, getSalonByCreador);
router.delete("/deleteSalonByUser/:user", validarJWT, deleteSalonByUser);
router.post(
  "/",
  [
    validarJWT,

    check("direccion", "La direccion es obligatoria").not().isEmpty(),
    check("telefono", "El telefono es obligatorio").not().isEmpty(),


    validarCampos,
  ],
  crearSalon
);

router.put(
  "/:id",
  [
    validarJWT,

    check("direccion", "La direccion es obligatoria").not().isEmpty(),
    check("telefono", "El telefono es obligatorio").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarSalon
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
