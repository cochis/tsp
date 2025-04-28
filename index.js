require('dotenv').config()
const express = require('express')
const cors = require('cors')
const xmlbuilder = require('xmlbuilder');
const { dbConnection } = require('./database/config')
const path = require('path')
const https = require('https')
const fs = require('fs')
var cron = require('node-cron');
var request = require('request')
// Crear el servidor de express
const app = express()
// Configurar CORS
app.use(cors())
//Carpeta publoc
app.use('/', express.static('client', { redirect: false }))
app.use(express.static('public'))
//lectura y paseo del body
app.use(express.json())
// Base de datos
const routes = [
  '/core',
  '/core/about',
  '/core/contact',
  '/core/market',
  '/core/faqs',
  '/core/pricing',
  '/core/mis-fiestas',
  '/core/galeria',
  '/core/ejemplos',
  '/core/check-in',
  '/core/templates/default/',
  '/core/templates/byFile/',
  '/core/examples',
  '/core/market',
  '/core/vista-proveedor/',
  '/core/faqs',
  '/core/templates/default/',
  '/auth/login',
  '/auth/register',
  // Add more routes as needed
];
app.get('/api/sitemap.xml', (req, res) => {
  const root = xmlbuilder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
  root.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

  routes.forEach(route => {
    const url = root.ele('url');
    url.ele('loc', `https://tickets.cochisweb.com${route}`);
    // You can add more elements like <changefreq> and <priority> here if needed
  });

  res.header('Content-Type', 'application/xml');
  res.send(root.end({ pretty: true }));
});


dbConnection()
// Rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/roles', require('./routes/role'))
app.use('/api/tipo-centros', require('./routes/tipoCentro'))
app.use('/api/pushes', require('./routes/push'))
app.use('/api/contactos', require('./routes/contacto'))
app.use('/api/login', require('./routes/auth'))
app.use('/api/eventos', require('./routes/evento'))
app.use('/api/monedas', require('./routes/moneda'))
app.use('/api/tipo-ubicaciones', require('./routes/tipoUbicacion'))
app.use('/api/proveedors', require('./routes/proveedor'))
app.use('/api/items', require('./routes/item'))
app.use('/api/img-items', require('./routes/imgItem'))
app.use('/api/fondos', require('./routes/fondo'))
app.use('/api/tipo-color', require('./routes/tipoColor'))
app.use('/api/tipo-contacto', require('./routes/tipoContacto'))
app.use('/api/tipo-item', require('./routes/tipoItem'))
app.use('/api/tipo-media', require('./routes/tipoMedia'))
app.use('/api/categoria-item', require('./routes/categoriaItem'))
app.use('/api/ejemplos', require('./routes/ejemplo'))
app.use('/api/parametros', require('./routes/parametro'))
app.use('/api/compras', require('./routes/compra'))
app.use('/api/status-compras', require('./routes/statusCompra'))
app.use('/api/paquetes', require('./routes/paquete'))
app.use('/api/email', require('./routes/email'))
app.use('/api/grupos', require('./routes/grupo'))
app.use('/api/tickets', require('./routes/ticket'))
app.use('/api/fiestas', require('./routes/fiesta'))
app.use('/api/invitacions', require('./routes/invitacion'))
app.use('/api/tipoModulos', require('./routes/tipoModulo'))
app.use('/api/templates', require('./routes/template'))
app.use('/api/moduloTemplates', require('./routes/moduloTemplate'))
app.use('/api/tokenPush', require('./routes/tokenPush'))
app.use('/api/salones', require('./routes/salon'))
app.use('/api/boletos', require('./routes/boleto'))
app.use('/api/upload', require('./routes/uploads'))
app.use('/api/search', require('./routes/busquedas'))
app.use('/api/galeria', require('./routes/galeria'))
app.use('/api/redes', require('./routes/red'))
app.use('/api/logs', require('./routes/log'))
app.use('/api/stripes', require('./routes/stripe'))
app.use('/api/cps', require('./routes/cp'))
app.use('/api/calificaciones', require('./routes/calificacion'))
app.use('/api/cotizaciones', require('./routes/cotizacion'))
app.use('/api/estatus-cotizaciones', require('./routes/estatusCotizacion'))
app.use('/api/paises', require('./routes/pais'))
app.use('/api/files', require('./routes/file'))
app.use('/api/datas', require('./routes/data'))
app.use('/api/mail-templates', require('./routes/mailTemplate'))
app.get('*', function (req, res, next) {
  res.sendFile(path.resolve('client/index.html'))
})
app.listen(process.env.PORT, () => {
  console.info(
    '__________________________________________________________________________________________________',
  )
  console.info(
    '__________________________________________________________________________________________________',
  )
  console.info('Servidor corriendo en puerto ' + process.env.PORT)
})

/* cron.schedule(' 0 0 * * *', () => {
  let invitacionesURL = process.env.URLAPI + 'fiestas/changeStatus'
  request(invitacionesURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
    }
  })

}); */




