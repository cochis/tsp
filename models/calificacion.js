const { Schema, model } = require('mongoose')
const CalificacionSchema = Schema({
  cotizacion: {
    type: Schema.Types.ObjectId,
    ref: "Cotizacion",
    required: true
  },

  calificacionPlat: {
    type: Number,
    default: 0

  },
  comentarios: {
    type: String,
  },
  productos: {
    type: Object,
    required: true,
  },
  usuarioCreated: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    default: null
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

CalificacionSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Calificacion', CalificacionSchema)
