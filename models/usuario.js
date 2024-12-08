const { Schema, model } = require('mongoose')
const UsuarioSchema = Schema({
  tipoCentro: {
    type: Schema.Types.ObjectId,
    ref: "TipoCentro",
    default: null

  },
  nombre: {
    type: String,
    required: true,
  },
  apellidoPaterno: {
    type: String,
    required: true,
  },
  apellidoMaterno: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  img: {
    type: String,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true
  },
  salon: [{
    type: Schema.Types.ObjectId,
    ref: "Salon",

  }],
  usuarioCreated: [{
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    default: null

  }],
  google: {
    type: Boolean,
    default: false,
  },
  cantidadFiestas: {
    type: Number,
    default: 0,

  },
  cantidadGalerias: {
    type: Number,
    default: 0,

  },
  compras: [{
    type: Object

  }],
  pushNotification: {
    type: Object,
    default: null
  },
  aceptoPolitica: {
    type: Boolean,
    default: false,
  },
  aceptoTerminos: {
    type: Boolean,
    default: false,
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

UsuarioSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Usuario', UsuarioSchema)
