/*
Ruta : api/items
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getItems,
  crearItem,
  actualizarItem,
  isActive,
  getItemById,
  getAllItems,
  getItemsByEmail,
  getItemsByProveedor
} = require("../controllers/item");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getItems);
router.get("/all", getAllItems);
router.get("/:uid", getItemById);
router.get("/email/:email", validarJWT, getItemsByEmail);
router.get("/proveedor/:proveedor", validarJWT, getItemsByProveedor);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),


    validarCampos,
  ],
  crearItem
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),


    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarItem
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
