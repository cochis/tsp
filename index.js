require('dotenv').config()
const express = require('express')
const cors = require('cors')
const xmlbuilder = require('xmlbuilder');
const { dbConnection } = require('./database/config')
const path = require('path')
const https = require('https')
const fs = require('fs')
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
  '/core/pricing',
  '/core/mis-fiestas',
  '/core/info-fiesta',
  '/core/galeria',
  '/core/salones',
  '/core/salones/vista-salones',
  '/core/salones/editar-salon',
  '/core/salones/crear-salon',
  '/core/usuarios',
  '/core/usuarios/vista-usuarios',
  '/core/usuarios/editar-usuario',
  '/core/usuarios/crear-usuario',
  '/core/fiestas',
  '/core/fiestas/vista-fiestas',
  '/core/fiestas/editar-fiesta',
  '/core/fiestas/crear-fiesta',
  '/core/agregar-invitado',
  '/core/boletos',
  '/core/boletos/vista-boletos',
  '/core/boletos/editar-boleto',
  '/core/boletos/crear-boleto',
  '/core/roles',
  '/core/roles/vista-roles',
  '/core/roles/editar-rol',
  '/core/roles/crear-rol',
  '/core/grupos',
  '/core/grupos/vista-grupos',
  '/core/grupos/editar-grupo',
  '/core/grupos/crear-grupo',
  '/core/eventos',
  '/core/eventos/vista-eventos',
  '/core/eventos/editar-evento',
  '/core/eventos/crear-evento',
  '/core/tipo-cantidad',
  '/core/tipo-cantidad/vista-paquetes',
  '/core/tipo-cantidad/editar-tipo-cantidad',
  '/core/tipo-cantidad/crear-tipo-cantidad',
  '/core/status-compra',
  '/core/status-compra/vista-status-compra',
  '/core/status-compra/crear-status-compra',
  '/core/status-compra/editar-status-compra',
  '/core/check-in',
  '/core/invitaciones/xv/xv2',
  '/core/templates/default',
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
app.use('/api/logs', require('./routes/log'))
app.use('/api/stripes', require('./routes/stripe'))
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
