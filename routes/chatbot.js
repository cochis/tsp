/*
Ruta : api/chatbots
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {

  crearChatbot,

} = require("../controllers/chatbot");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.post(
  "/",
  [

    validarCampos,
  ],
  crearChatbot
);



module.exports = router;
