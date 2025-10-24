const ChatLog = require('../models/chatLog');

// --- 1. Definición de Respuestas (SIN CAMBIOS) ---
const botResponses = {
    'GREETING': '¡Hola! 👋 Soy tu asistente de MyTicketParty. Por favor, selecciona una opción del menú para ayudarte.',
    'FAQ_DESIGN': 'R: Puedes personalizar completamente tu invitación. Te permitimos cambiar colores, tipografías, subir tus propias fotos, videos y logos...',
    'FAQ_GUESTS': 'R: Puedes importar tu lista de invitados desde Excel/CSV o añadirlos manualmente...',
    'FAQ_LOGISTICS': 'R: Tus invitados confirman (RSVP) desde la invitación. Puedes hacerles preguntas personalizadas...',
    'FAQ_CHECKIN': 'R: Cada invitación genera un código QR único. El día del evento, tu staff escanea el QR...',
    'FAQ_PAYMENTS': 'R: Ofrecemos un plan gratuito con funciones básicas. Nuestros planes de pago incluyen funciones avanzadas...',
    'FAQ_GUEST_VIEW': 'R: (Para Invitados) No necesitas descargar ninguna app. La invitación se abre en tu navegador...',
    'CONTACT': 'R: ¡Claro! Puedes contactar a un asesor humano por estos medios:\n\n📞 Teléfono: 55 7069 8830\n📱 WhatsApp: 55 7069 8830\n✉️ Correo: info@cochisweb.com',
    'DEFAULT': 'Opción no válida. Por favor, elige una del menú.',
    'BACK_TO_MENU': '¿Puedo ayudarte con algo más?'
};

// --- 2. Definición del Menú (SIN CAMBIOS) ---
const mainMenu = [
    { key: 'FAQ_DESIGN', text: '1. Creación y Diseño' },
    { key: 'FAQ_GUESTS', text: '2. Envío y Gestión de Invitados' },
    { key: 'FAQ_LOGISTICS', text: '3. Logística y RSVP' },
    { key: 'FAQ_CHECKIN', text: '4. Check-in (Día del evento)' },
    { key: 'FAQ_PAYMENTS', text: '5. Cuenta y Pagos' },
    { key: 'FAQ_GUEST_VIEW', text: '6. Soy un Invitado (Dudas)' },
    { key: 'CONTACT', text: '7. Contactar a un Asesor' },
];

// --- 3. Función Helper para DB (SIN CAMBIOS) ---
const saveChat = async (sessionId, from, message, intentKey = null) => {
    try {
        const log = new ChatLog({ sessionId, from, message, intentKey });
        await log.save();
    } catch (error) {
        console.error('Error al guardar en ChatLog DB:', error);
    }
};

/**
 * Lógica del Socket
 */
const socketController = (socket) => {

    const sessionId = socket.id;
    console.log(`Cliente conectado: ${sessionId}`);

    // --- 4. CAMBIO: YA NO ENVIAMOS MENÚ AL CONECTAR ---
    // El 'socket.emit' de bienvenida que estaba aquí se ELIMINA.

    // --- 5. NUEVO LISTENER: Esperamos la solicitud del frontend ---
    /**
     * El frontend emite este evento cuando está 100% listo para recibir el menú.
     */
    socket.on('solicitar-bienvenida', async (payload) => {
        // payload = { userId: '...' }
        console.log(`Cliente ${sessionId} solicitó bienvenida.`);

        const welcomeMessage = {
            from: 'bot',
            text: botResponses.GREETING,
            timestamp: Math.floor(Date.now() / 1000),
            menu: mainMenu // Adjuntamos el menú
        };
        socket.emit('mensaje-nuevo', welcomeMessage);

        // Guardamos el saludo del bot en la DB
        await saveChat(sessionId, 'bot', welcomeMessage.text);
    });


    // --- 6. LÓGICA DE RESPUESTA A LAS FAQS (SIN CAMBIOS) ---
    // Escucha la opción del usuario
    socket.on('enviar-opcion', async (payload) => {

        // 6.1. Guardar la PREGUNTA del usuario
        await saveChat(sessionId, 'user', payload.text, payload.key);

        // 6.2. Buscar la RESPUESTA
        const responseKey = payload.key || 'DEFAULT';
        const botResponseText = botResponses[responseKey] || botResponses.DEFAULT;

        // 6.3. Preparar el mensaje de respuesta
        const botMessage = {
            from: 'bot',
            text: botResponseText,
            timestamp: Math.floor(Date.now() / 1000),
        };

        // 6.4. Guardar la RESPUESTA del bot
        await saveChat(sessionId, 'bot', botMessage.text);

        // 6.5. Enviar la respuesta
        socket.emit('mensaje-nuevo', botMessage);

        // 6.6. Vover al menú principal (setTimeout)
        setTimeout(async () => {
            const followUpMessage = {
                from: 'bot',
                text: botResponses.BACK_TO_MENU,
                timestamp: Math.floor(Date.now() / 1000),
                menu: mainMenu // Volvemos a enviar el menú
            };
            socket.emit('mensaje-nuevo', followUpMessage);
            await saveChat(sessionId, 'bot', followUpMessage.text);
        }, 1500); // Espera 1.5 segundos
    });

    // --- 7. DESCONEXIÓN (SIN CAMBIOS) ---
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${sessionId}`);
    });
};

module.exports = {
    socketController,
};