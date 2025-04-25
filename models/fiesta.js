const { Schema, model } = require('mongoose')
const FiestaSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  evento: {
    type: Schema.Types.ObjectId,
    ref: "Evento",
  },
  cantidad: {
    type: Number,
    default: 0
  },

  fecha: {
    type: Number,
    required: true,
  },
  calle: {
    type: String,

  },
  numeroInt: {
    type: String,

  },
  numeroExt: {
    type: String,

  },
  municipioDelegacion: {
    type: String,

  },
  coloniaBarrio: {
    type: String,

  },
  cp: {
    type: Number,

  },
  estado: {
    type: String,

  },
  pais: {
    type: String,

  },
  comoLlegar: {
    type: String,

  },
  lat: {
    type: Number,

  },
  long: {
    type: Number,

  },

  usuarioFiesta: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",

  },

  salon: {
    type: Schema.Types.ObjectId,
    ref: "Salon",

  },
  img: {
    type: String,
    default: 'fiesta-default.jpg',

  },
  invitacion: {
    type: String,
  },
  activacreadated: {
    type: Boolean,
    default: true,
  },
  realizada: {
    type: Boolean,
    default: false,
  },
  galeria: {
    type: Boolean,
    default: false,
  },
  checking: {
    type: Boolean,
    default: false,
  },
  mesaOk: {
    type: Boolean,
    default: false,
  },
  example: {
    type: Boolean,
    default: false,
  },
  img: {
    type: String,
    default: '',

  },
  croquis: {
    type: String,
    default: 'fiesta-default.jpg',

  },
  croquisOk: {
    type: Boolean,
    default: false,

  },
  mensaje: {
    type: String,
    default: '',

  },
  recordatorioOk: {
    type: Boolean,
    default: false,

  },
  recordatorio: {
    type: String,
    default: '',

  },
  usuarioCreated: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  activated: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Number,
    required: true,
    default: Date.now(),
  },
  lastEdited: {
    type: Number,
    required: true,
    default: Date.now(),
  },

})

FiestaSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Fiesta', FiestaSchema)
