/*
    Rutas de Chat
    host + /api/chat
*/
const { Router } = require('express');
const { check } = require('express-validator'); // (Opcional, si quieres validar)
const { validarCampos } = require('../middlewares/validar-campos'); // (Opcional)
const { sendChatMessage, getChatUpdates } = require('../controllers/chat');

const router = Router();

// Endpoint para que el usuario envíe un mensaje
router.post(
    '/send',
    [ // Opcional: validaciones
        check('userId', 'El userId es obligatorio').not().isEmpty(),
        check('text', 'El texto es obligatorio').not().isEmpty(),
        validarCampos
    ],
    sendChatMessage
);

// Endpoint para que el frontend pida actualizaciones (Polling)
router.get(
    '/updates',
    [ // Opcional: validaciones
        check('userId', 'El userId es obligatorio').not().isEmpty(),
        check('lastTimestamp', 'El lastTimestamp es obligatorio').not().isEmpty(),
        validarCampos
    ],
    getChatUpdates
);

module.exports = router;