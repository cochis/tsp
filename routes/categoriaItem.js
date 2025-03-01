/*
Ruta : api/categoriaItems
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getCategoriaItems,
  crearCategoriaItem,
  actualizarCategoriaItem,
  isActive,
  getCategoriaItemById,
  getAllCategoriaItems,
  getCategoriaItemsByEmail
} = require("../controllers/categoriaItem");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getCategoriaItems);
router.get("/all", getAllCategoriaItems);
router.get("/:uid", validarJWT, getCategoriaItemById);
router.get("/email/:email", validarJWT, getCategoriaItemsByEmail);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearCategoriaItem
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
  actualizarCategoriaItem
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
