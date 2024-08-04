const { Schema, model } = require('mongoose')
const TemplateSchema = Schema({
  nombre: {
    type: String,
    required: true
  },
  evento: {
    type: Schema.Types.ObjectId,
    ref: "Evento",
    required: true
  },
  modulos: [{
    type: Schema.Types.ObjectId,
    ref: "ModuloTemplate",
    required: true
  }],
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

TemplateSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Template', TemplateSchema)
