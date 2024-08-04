const { Schema, model } = require('mongoose')
const TipoModuloSchema = Schema({
  nombre: {
    type: String,
    required: true
  },
  clave: {
    type: String,
    required: true
  },
  values: {
    type: Object
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

TipoModuloSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('TipoModulo', TipoModuloSchema)
