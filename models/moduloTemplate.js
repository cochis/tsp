const { Schema, model } = require('mongoose')
const ModuloTemplateSchema = Schema({
  nombre: {
    type: String,
    required: true
  },
  tipoModulo: {
    type: Schema.Types.ObjectId,
    ref: "TipoModulo",
    required: true
  },
  values: [{
    type: Object
  }],
  diseno: {
    type: String
  },
  css: {
    type: String
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

ModuloTemplateSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('ModuloTemplate', ModuloTemplateSchema)
