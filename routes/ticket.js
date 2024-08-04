/*
Ruta : api/ticket
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getTickets,
  crearTicket,
  actualizarTicket,
  isActive,
  getTicketById,
  getAllTickets
} = require("../controllers/ticket");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getTickets);
router.get("/all", validarJWT, getAllTickets);
router.get("/:uid", validarAdminJWT, getTicketById);
router.post(
  "/",
  [
    validarJWT,

    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearTicket
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
  actualizarTicket
);


router.put(
  "/isActive/:id",
  [
    validarAdminJWT,
    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  isActive
);


module.exports = router;
