/*
Ruta : api/shareds
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
    getShareds,
    crearShared,
    actualizarShared,
    isActive,
    getSharedById,
    getAllShareds,
    getSharedsByEmail,
    getSharedByFiestaBoleto
} = require("../controllers/shared");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getShareds);
router.get("/all", validarJWT, getAllShareds);
router.get("/:uid", validarJWT, getSharedById);
router.get("/email/:email", validarJWT, getSharedsByEmail);
router.get("/fiesta-boleto/:fiesta/:boleto", getSharedByFiestaBoleto);
router.post(
    "/",
    [
        validarJWT,
        check("fiesta", "La fiesta es obligatoria").not().isEmpty(),
        check("boleto", "El boleto es obligatorio").not().isEmpty(),
        check("data", "La data es obligatoria").not().isEmpty(),
        validarCampos,
    ],
    crearShared
);

router.put(
    "/:id",
    [
        validarJWT,


        check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
        validarCampos,
    ],
    actualizarShared
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
