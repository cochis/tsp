const { Schema, model } = require('mongoose')
const CotizacionSchema = Schema({
  nombreEvento: {
    type: String,
    required: true,
  },
  nombreAnf: {
    type: String,
    required: true,
  },
  apellidoPatAnf: {
    type: String,
    required: true,
  },
  apellidoMatAnf: {
    type: String
  },
  emailAnf: {
    type: String,
    required: true,
  },
  telfonoAnf: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,

  },
  ubicacion: {
    type: String,

  },
  fechaEvento: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,

  },
  lng: {
    type: Number,

  },
  isAnfitironFestejado: {
    type: Boolean,
    required: true,
  },
  nombreFes: {
    type: String
  },
  apellidoPatFes: {
    type: String
  },
  apellidoMatFes: {
    type: String
  },
  proveedor: {
    type: Schema.Types.ObjectId,
    ref: "Proveedor",
    required: true
  },
  productos: {
    type: Object,
    required: true,
  },
  estatusCotizacion: {
    type: Schema.Types.ObjectId,
    ref: "EstatusCotizacion",
    required: true
  },
  vista: {
    type: Boolean,
    default: false,
  },
  calificada: {
    type: Boolean,
    default: false,
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

CotizacionSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Cotizacion', CotizacionSchema)
