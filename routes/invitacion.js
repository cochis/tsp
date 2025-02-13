/*
Ruta : api/invitacions
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getInvitacions,
  crearInvitacion,
  actualizarInvitacion,
  isActive,
  getInvitacionById,
  getAllInvitacions,
  getInvitacionForSln,
  getInvitacionByClave,
  getInvitacionByFiesta,
  deleteInvitacionByUser,
  getInvitacionBySalon
} = require("../controllers/invitacion");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getInvitacions);
router.get("/all", getAllInvitacions);
router.get("/all/salon", getInvitacionForSln);
router.get("/:uid", getInvitacionById);
router.get("/fiesta/:id", getInvitacionByFiesta);
router.get("/salon/:id", getInvitacionBySalon);
router.delete("/deleteInvitacionbyUser/:user", deleteInvitacionByUser);
router.get("/clave/:clave", getInvitacionByClave);
router.post(
  "/",
  [
    validarJWT,


    validarCampos,
  ],
  crearInvitacion
);

router.put(
  "/:id",
  [
    validarJWT,

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarInvitacion
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
