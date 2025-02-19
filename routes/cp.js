/*
Ruta : api/cps
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getCps,
  crearCp,
  actualizarCp,
  isActive,
  getCpById,
  getAllCps,
  getCpsByEmail,
  deleteCPS,
  getCpsByCP,
  getCpsByPaisCP
} = require("../controllers/cp");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getCps);
router.get("/delete", validarJWT, deleteCPS);
router.get("/all", validarJWT, getAllCps);
router.get("/:uid", validarJWT, getCpById);
router.get("/cp/:cp", validarJWT, getCpsByCP);
router.get("/pais/:pais/cp/:cp", validarJWT, getCpsByPaisCP);
router.get("/email/:email", validarJWT, getCpsByEmail);
router.post(
  "/",
  [
    validarJWT,


    validarCampos,
  ],
  crearCp
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
  actualizarCp
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
