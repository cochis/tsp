const { response } = require('express')
const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')

const Usuario = require('../models/usuario')
const Salon = require('../models/salon')
const Fiesta = require('../models/fiesta')
const Boleto = require('../models/boleto')
const Role = require('../models/role')
const Grupo = require('../models/grupo')
const Evento = require('../models/evento')



//getCiclos Ciclo
const getTodo = async (req, res = response) => {
  const busqueda = req.params.busqueda
  const regex = new RegExp(busqueda, 'i')

  const [usuarios, maestros, alumnos, padres, cursos] = await Promise.all([
    Usuario.find({
      nombre: regex,
    })
  ])
  res.json({
    ok: true,
    busqueda,
    uid: req.uid,
    usuarios
  })
}
const getDocumentosColeccion = async (req, res = response) => {
  const busqueda = req.params.busqueda

  const tabla = req.params.tabla

  const admin = req.params.admin
  const uid = req.uid





  const regex = new RegExp(busqueda, 'i')



  let data = []
  switch (tabla) {

    case 'usuarios':
      if (admin === 'false') {
        data = await Usuario.find(
          {
            $and: [
              {
                $or: [
                  { nombre: regex },
                  { apellidoPaterno: regex },
                  { apellidoMaterno: regex }
                ]
              },
              { "usuarioCreated": uid }
            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')

      } else {
        data = await Usuario.find(
          {
            $or: [
              { nombre: regex },
              { apellidoPaterno: regex },
              { apellidoMaterno: regex }
            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      }
      break
    case 'salones':
      if (admin === 'false') {
        data = await Salon.find(
          {
            $and: [
              {
                $or: [
                  { nombre: regex },
                  { direccion: regex },
                ]
              },
              { "usuarioCreated": uid }
            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      } else {
        data = await Salon.find(
          {
            $or: [
              { nombre: regex },
              { direccion: regex },
            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      }
      break
    case 'fiestas':
      if (admin === 'false') {
        data = await Fiesta.find(
          {
            $and: [
              {
                $or: [
                  { nombre: regex },

                  { calle: regex },
                ]
              },
              { "usuarioCreated": uid }
            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      } else {
        data = await Fiesta.find(
          {
            $or: [
              { nombre: regex },
              { calle: regex },


            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      }
      break
    case 'boletos':
      if (admin === 'false') {
        data = await Boleto.find(
          {
            $and: [
              {
                $or: [
                  { nombre: regex },
                  { cantidad: regex },
                  { fecha: regex },
                  { lugar: regex },
                ]
              },
              { "usuarioCreated": uid }
            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      } else {
        data = await Boleto.find(
          {
            $or: [
              { nombre: regex },
              { cantidad: regex },
              { fecha: regex },
              { lugar: regex },
            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      }
      break
    case 'roles':
      if (admin === 'false') {
        data = await Role.find(
          {
            $and: [
              {
                $or: [
                  { nombre: regex },
                  { clave: regex },
                ]
              },
              { "usuarioCreated": uid }
            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      } else {
        data = await Role.find(
          {
            $or: [
              { nombre: regex },
              { clave: regex },
            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      }
      break
    case 'salones':

      if (admin === 'false') {
        data = await Salon.find(
          {
            $and: [
              {
                $or: [
                  { nombre: regex },
                  { email: regex },
                ]
              },
              { "usuarioCreated": uid }
            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      } else {
        data = await Salon.find(
          {
            $or: [
              { nombre: regex },
              { clave: regex },
            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      }
      break
    case 'grupos':
      if (admin === 'false') {
        data = await Grupo.find(
          {
            $and: [
              {
                $or: [
                  { nombre: regex },
                  { clave: regex },
                ]
              },
              { "usuarioCreated": uid }
            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      } else {
        data = await Grupo.find(
          {
            $or: [
              { nombre: regex },
              { clave: regex },
            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      }
      break
    case 'eventos':
      if (admin === 'false') {
        data = await Evento.find(
          {
            $and: [
              {
                $or: [
                  { nombre: regex },
                  { clave: regex },
                ]
              },
              { "usuarioCreated": uid }
            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      } else {
        data = await Evento.find(
          {
            $or: [
              { nombre: regex },
              { clave: regex },
            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      }
      break
    default:
      res.status(400).json({
        ok: false,
        msg: 'No se encontro  la tabla',
      })
  }

  res.json({
    ok: true,
    busqueda,
    uid: req.uid,
    resultados: data,
  })
}
const getDocumentosColeccionCatalogo = async (req, res = response) => {
  const busqueda = req.params.busqueda
  const tabla = req.params.tabla
  const regex = new RegExp(busqueda, 'i')


  let data = []
  switch (tabla) {
    case 'usuarios':
      data = await Usuario.find({
        $or: [

          { role: busqueda },
          { salon: busqueda },


        ],
      })
      break


    default:
      res.status(400).json({
        ok: false,
        msg: 'No se encontro  la tabla',
      })
  }

  res.json({
    ok: true,
    busqueda,
    uid: req.uid,
    resultados: data,
  })
}

module.exports = {
  getTodo,
  getDocumentosColeccion,
  getDocumentosColeccionCatalogo
}
