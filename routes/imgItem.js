/*
Ruta : api/imgItems
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getImgItems,
  crearImgItem,
  actualizarImgItem,
  isActive,
  getImgItemById,
  getAllImgItems,
  getImgItemsByEmail,
  existByImg,
  existByName,
  existByItem
} = require("../controllers/imgItem");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getImgItems);
router.get("/all", validarJWT, getAllImgItems);
router.get("/:uid", validarJWT, getImgItemById);
router.get("/email/:email", validarJWT, getImgItemsByEmail);
router.get("/by-item/:item", validarJWT, existByItem);
router.get("/by-name/:name", validarJWT, existByName);
router.get("/by-img/:img", validarJWT, existByImg);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),


    validarCampos,
  ],
  crearImgItem
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),


    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarImgItem
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
