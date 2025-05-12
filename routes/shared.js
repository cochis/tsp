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

router.get("/", getShareds);
router.get("/all", getAllShareds);
router.get("/:uid", getSharedById);
router.get("/email/:email", getSharedsByEmail);
router.get("/fiesta-boleto/:fiesta/:boleto", getSharedByFiestaBoleto);
router.post(
    "/",
    [

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



        check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
        validarCampos,
    ],
    actualizarShared
);


router.put(
    "/isActive/:id",
    [

        check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
        validarCampos,
    ],
    isActive
);


module.exports = router;
