const { Schema, model } = require('mongoose');

const ChatLogSchema = Schema({
    /**
     * Usaremos el ID del socket como 'sessionId' para agrupar
     * todos los mensajes de una misma conversación.
     */
    sessionId: {
        type: String,
        required: true,
    },
    /**
     * Quién envió el mensaje.
     */
    from: {
        type: String,
        required: true,
        enum: ['user', 'bot'] // Solo puede ser 'user' o 'bot'
    },
    /**
     * El texto del mensaje.
     */
    message: {
        type: String,
        required: true
    },
    /**
     * (Opcional) La 'llave' de la intención que el usuario
     * presionó (ej: 'FAQ_DESIGN'). Es útil para analítica.
     */
    intentKey: {
        type: String
    },
    /**
     * Fecha del mensaje.
     */
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Opcional: para limpiar la respuesta de Mongoose
ChatLogSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('ChatLog', ChatLogSchema);