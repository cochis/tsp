const { response, request } = require('express');

// -------------------------------------------------------------------------
// NOTA DE IMPLEMENTACIÓN:
// Usamos un Map en memoria para simular una base de datos de mensajes
// pendientes. Esto es solo para fines de demostración.
//
// En producción, deberías:
// 1. En `sendChatMessage`: Guardar el mensaje del usuario y la respuesta 
//    del bot en tu base de datos (MongoDB, etc.).
// 2. En `getChatUpdates`: Hacer una consulta a tu base de datos (ej:
//    db.messages.find({ userId: userId, timestamp: { $gt: lastTimestamp } })
//
// Key: userId
// Value: Array de mensajes pendientes para ese usuario
const pendingMessagesStore = new Map();
// -------------------------------------------------------------------------


/**
 * Endpoint para RECIBIR un mensaje del usuario
 * (POST /api/chat/send)
 */
const sendChatMessage = (req = request, res = response) => {
    const { userId, text } = req.body;

    if (!userId || !text) {
        return res.status(400).json({ error: 'Faltan userId o text' });
    }

    // 1. Guardar el mensaje del usuario (en tu DB real)
    console.log(`[Usuario: ${userId}] Mensaje recibido: ${text}`);

    // 2. *** AQUÍ VA TU LÓGICA DE IA O NEGOCIO ***
    // Simulación: Procesas el mensaje y generas una respuesta del bot.
    // (Ej: Llamar a Dialogflow, OpenAI, o consultar tu DB de eventos)
    const botResponseText = `Recibí tu mensaje: "${text}". En un momento te respondo sobre tu evento.`;

    const botMessage = {
        from: 'bot',
        text: botResponseText,
        timestamp: Math.floor(Date.now() / 1000) // Timestamp en segundos
    };

    // 3. Agregar la respuesta del bot a la cola de "pendientes"
    if (!pendingMessagesStore.has(userId)) {
        pendingMessagesStore.set(userId, []);
    }
    pendingMessagesStore.get(userId).push(botMessage);

    // 4. Responder al frontend INMEDIATAMENTE (solo para confirmar recepción)
    res.status(201).json({ status: 'received' });
};


/**
 * Endpoint para que el Frontend "pregunte" por actualizaciones
 * (GET /api/chat/updates)
 */
const getChatUpdates = (req = request, res = response) => {
    const { userId, lastTimestamp } = req.query;

    if (!userId || !lastTimestamp) {
        return res.status(400).json({ error: 'Faltan userId o lastTimestamp en los query params' });
    }

    // 1. Obtener todos los mensajes pendientes para este usuario
    const pending = pendingMessagesStore.get(userId) || [];

    // 2. Filtrar solo los mensajes que son MÁS NUEVOS que el último que vio el cliente
    const newMessages = pending.filter(
        msg => msg.timestamp > parseInt(lastTimestamp, 10)
    );

    // 3. Enviar solo los mensajes nuevos
    // (Nota: No los borramos del Map, el `lastTimestamp` se encargará 
    // de no volver a enviarlos en la siguiente petición de polling)
    res.status(200).json({ messages: newMessages });
};


module.exports = {
    sendChatMessage,
    getChatUpdates
};