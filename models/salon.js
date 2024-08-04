const { Schema, model } = require('mongoose')
const SalonSchema = Schema({
  nombre: {
    type: String,

  },
  img: {
    type: String,
    default: '',
  },
  direccion: {
    type: String,
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
    type: String,

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
  telefono: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  ubicacionGoogle: {
    type: String,

  },
  usuarioCreated: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  activated: {
    type: Boolean,
    default: true,
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

SalonSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Salon', SalonSchema)
