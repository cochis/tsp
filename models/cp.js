const { Schema, model } = require('mongoose')
const CpSchema = Schema({
  d_codigo: {
    type: String,
  },
  d_asenta: {
    type: String,
  },
  d_tipo_asenta: {
    type: String,
  },
  D_mnpio: {
    type: String,
  },
  d_estado: {
    type: String,
  },
  d_ciudad: {
    type: String,
  },
  d_CP: {
    type: String,
  },
  c_estado: {
    type: String,
  },
  c_oficina: {
    type: String,
  },
  c_CP: {
    type: String,
  },
  c_tipo_asenta: {
    type: String,
  },
  c_mnpio: {
    type: String,
  },
  id_asenta_cpcons: {
    type: String,
  },
  d_zona: {
    type: String,
  },
  c_cve_ciudad: {
    type: String,
  },
  pais_clv: {
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

CpSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Cp', CpSchema)
