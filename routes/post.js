/*
Ruta : api/posts
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getPosts,
  crearPost,
  actualizarPost,
  isActive,
  getPostById,
  getAllPosts,
  getPostsByEmail
} = require("../controllers/post");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/",  getPosts);
router.get("/all",  getAllPosts);
router.get("/:uid",  getPostById);
router.get("/email/:email",  getPostsByEmail);
router.post(
  "/",
  [
    validarJWT,


  ],
  crearPost
);

router.put(
  "/:id",
  [
    validarJWT,
    

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarPost
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
