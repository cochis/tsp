
export const CHAT_FLOW = {
    start: {
        text: 'Hola 👋 ¿En qué puedo ayudarte?',
        options: [
            { label: 'Ver precios', next: 'precios' },
            { label: 'Ver diseños', next: 'disenos' },
            { label: 'Contacto', next: 'contacto' },

        ]
    },
    precios: {
        text: 'Nuestros paquetes empiezan desde $399.',
        options: [

            { label: 'Invitación Digital', next: 'invitacion' },
            { label: 'Galería de fotos para invitados', next: 'galeria' },
            { label: 'Logistica del evento', next: 'logistica' },

            { label: 'Volver', next: 'start' }

        ]
    },




    invitacion: {
        text: 'Invitación digital',
        options: [

            { label: '¿Cómo creo una invitación digital?', next: 'creacionInvitacion' },
            { label: 'Volver', next: 'start' }
        ],
        info: `
        <div class="promo-section"  >
  <h2 class="text-center pH">🎉 ¡Haz que tu evento sea inolvidable desde la invitación!</h2>
  <p class="pChat">
    Crea <strong>invitaciones digitales personalizadas</strong> con un solo clic. Ya seas
    <strong>anfitrión, salón de eventos o proveedor</strong>, en <em>MyTicketParty</em> puedes diseñar, enviar y gestionar
    tus invitaciones de forma rápida, elegante y profesional.
  </p>
  <ul class="pChat">
    <li class="pChat">  <i   class="bi bi-check iconChat"></i>Elige entre modelos exclusivos</li>
    <li class="pChat">  <i   class="bi bi-check iconChat"></i>Registra la ubicación del evento fácilmente</li>
    <li class="pChat">  <i   class="bi bi-check iconChat"></i>Genera boletos digitales únicos para cada invitado</li>
    <li class="pChat">  <i   class="bi bi-check iconChat"></i>Lleva el control de confirmaciones en tiempo real</li>
  </ul>
  <p class="pChat">
    📲 <strong>Moderniza tus eventos</strong> con invitaciones que impresionan desde el primer vistazo.
  </p>
  
</div>
        `,
        costo: 499
    },

    creacionInvitacion: {
        text: 'Invitación digital',
        options: [


            { label: 'Volver', next: 'start' }
        ],
        info: `
        <ul class="lstNone">
        <li class="pChat"> Regístrate como <b>Anfitrión, Salón de Eventos o Proveedor</b>.</li>
        <li class="pChat">Registra la ubicación donde se realizará el evento. Ten en cuenta que los datos ingresados serán los que aparecerán en la invitación.</li>
        <li class="pChat">Escoge el modelo de invitación: <b>Modelo Standard, Modelo por Archivo o Modelo Fancy</b>.</li>
        <li class="pChat">Completa el formulario del evento: <a class="aChat" href="https://forms.gle/vwr5yiTPbdsJEMW77">Formulario</a>.</li>
        <li class="pChat">Nosotros nos contactamos contigo para adecuar el diseño y mostrarle el resultado</li>
        <li class="pChat">Realizar lista de  <a class="aChat" href="http://myticketparty.com/assets/download/invitados.xlsx">invitados</a> </li>
        <li class="pChat">Usted decide si nosotros enviamos las invitaciones o usted</li>
        </ul>
        `,

    },
    logistica: {
        text: 'Logística',
        options: [

            { label: 'Volver', next: 'start' }
        ],
        info: `
        <div class="promo-logistica">
  <h2 class="pH tc">🎯 ¡Lleva tu evento al siguiente nivel con nuestra logística profesional!</h2>
  <p class="pChat">
     <strong class="tc">Va incluida en todas nuestras invitaciones</strong>  
  </p>
  <p class="pChat">
    En <strong>MyTicketParty</strong> no solo creamos invitaciones digitales, también te ayudamos a planificar y coordinar
    cada detalle de tu evento con nuestro servicio de <strong>logística integral</strong>.
  </p>
  <ul class="lstNone">
    <li class="pChat">  <i   class="bi bi-check iconChat"></i>Coordinación de locación y tiempos</li>
    <li class="pChat">  <i   class="bi bi-check iconChat"></i>Control de acceso con boletos digitales personalizados</li>
    <li class="pChat">  <i   class="bi bi-check iconChat"></i>Seguimiento de confirmaciones de asistencia (RSVP)</li>
    <li class="pChat">  <i   class="bi bi-check iconChat"></i>Reportes en tiempo real para una mejor toma de decisiones</li>
    <li class="pChat">  <i   class="bi bi-check iconChat"></i>Soporte antes, durante y después del evento</li>
  </ul>  
  <p class="pChat">
    🛠️ Nos encargamos de lo técnico, tú solo disfruta de tu evento.
  </p>
   
</div>
        `,
        costo: 0
    },
    galeria: {
        text: 'Galeria',
        options: [

            { label: 'Volver', next: 'start' }
        ],
        info: `
        <div class="promo-galeria">
  <h2 class="text-center pH">📸 ¡Haz que los recuerdos de tu evento vivan para siempre!</h2>
  <p class="pChat">
    Ahora puedes adquirir tu <strong>galería de imágenes personalizada</strong> y compartir con tus invitados
    los mejores momentos de tu celebración en un solo lugar.
  </p>
  <ul class="lstNone">
    <li class="pChat">  <i   class="bi bi-check iconChat"></i>Acceso exclusivo para ti y tus invitados</li>
    <li class="pChat">  <i   class="bi bi-check iconChat"></i>Visualización desde cualquier dispositivo</li>
    <li class="pChat">  <i   class="bi bi-check iconChat"></i>Álbum digital con diseño profesional</li>
    <li class="pChat">  <i   class="bi bi-check iconChat"></i>Descargue las fotos que sus invitados proporcionaron  </li>
  </ul>
  <p class="pChat">
    🎁 Ideal para bodas, cumpleaños, eventos sociales y empresariales.
  </p>
  
</div>
        `,
        costo: 399
    },

    disenos: {
        text: 'Mira nuestros diseños aquí: https://myticketparty.com/disenos',
        options: [

            { label: 'Volver', next: 'start' }
        ],
        info: `
        <div class="promo-modelos">
  <h2 class="text-center pH">🎨 ¡Elige el modelo de invitación que se adapta a tu estilo!</h2>
  <p class="pChat">
    En <strong>MyTicketParty</strong> te ofrecemos tres opciones únicas para personalizar tus invitaciones digitales
    según tus necesidades y el tipo de evento:
  </p>
  <ul class="lstNone">
    <li class="pChat"><strong>  <i   class="bi bi-check iconChat"></i>Modelo Estándar:</strong> Plantillas prediseñadas listas para usar, rápidas y elegantes.</li>
    <li class="pChat"><strong>  <i   class="bi bi-check iconChat"></i>Modelo por Archivo:</strong> Sube tu propio diseño personalizado y nosotros lo integramos.</li>
    <li class="pChat"><strong>  <i   class="bi bi-check iconChat"></i>Modelo Fancy:</strong> Invitaciones premium con animaciones, efectos especiales y diseño exclusivo.</li>
  </ul>
  <p class="pChat">
    🥳 Ya sea un evento formal, creativo o fuera de lo común, tenemos el modelo perfecto para ti.
  </p>
  <p >
      <a href="/core/examples" class="btn but2 tc aChat">Explora nuestros modelos</a>
  </p>
</div>
        `
    },



    //Contacto

    contacto: {
        text: 'Puedes contactarnos por estos medios',
        options: [
            { label: 'Facebook', next: 'facebook' },
            { label: 'Instagram', next: 'instagram' },
            { label: 'WhatsApp', next: 'whatsapp' },
            { label: 'TikTok', next: 'tiktok' },
            { label: 'Correo ', next: 'email' },
            { label: 'Telefóno ', next: 'phone' },
            { label: 'Pagina Web', next: 'web' },
            { label: 'Volver', next: 'start' }
        ]
    },
    ejemplos: {
        text: 'Estos son algunos ejemplos: https://myticketparty.com/ejemplos',
        options: [
            { label: 'Volver', next: 'start' }
        ]
    },
    facebook: {
        text: 'Facebook',
        options: [
            { label: 'Volver', next: 'start' }
        ],
        link: "https://www.facebook.com/people/My-TicketParty/61563610657240/",
        type: "link",
        linkText: "Facebook",
        icon: "bi bi-facebook",
    },
    instagram: {
        text: 'Instagram',
        options: [
            { label: 'Volver', next: 'start' }
        ],
        type: "link",
        link: "https://www.instagram.com/my_ticketparty",
        linkText: "Instagram",
        icon: "bi bi-instagram",

    },
    whatsapp: {
        text: 'WhatsApp',
        options: [
            { label: 'Volver', next: 'start' }
        ],
        type: "link",
        link: "https://api.whatsapp.com/send?phone=5515380666&text=Hola%20me%20interesa%20tu%20servicio",
        linkText: "WhatsApp",
        icon: "bi bi-whatsapp",

    },
    tiktok: {
        text: 'TikTok',
        options: [
            { label: 'Volver', next: 'start' }
        ],
        type: "link",
        link: "https://www.tiktok.com/@my.ticket.party",
        linkText: "TikTok",
        icon: "bi bi-tiktok",

    },
    email: {
        text: 'Correo electrónico',
        options: [
            { label: 'Volver', next: 'start' }
        ],
        type: "email",
        link: "info@cochisweb.com",
        linkText: "Enviar correo",
        icon: "bi bi-envelope",

    },
    web: {
        text: 'Pagina Web',
        options: [
            { label: 'Volver', next: 'start' }
        ],
        type: "web",
        link: "/core/contact",
        linkText: "Contacto",
        icon: "bi bi-at",

    },
    phone: {
        text: 'Telefóno',
        options: [
            { label: 'Volver', next: 'start' }
        ],
        type: "phone",
        link: "5566828251",
        linkText: "Llamar",
        icon: "bi bi-telephone",

    },
};
