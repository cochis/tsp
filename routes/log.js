/*
Ruta : api/logs
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getLogs,
  crearLog,
  actualizarLog,
  isActive,
  getLogById,
  getAllLogs ,
  getMyLogs
} = require("../controllers/log");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/",  getLogs);
router.get("/all",  getAllLogs);
router.get("/my-logs/:uid",  getMyLogs);
router.get("/:uid",    getLogById);
 
router.post(
  "/",
 crearLog
);

router.put(
  "/:id", 
  actualizarLog
);


router.put(
  "/isActive/:id", isActive
);


module.exports = router;
