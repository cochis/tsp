const { Schema, model } = require('mongoose')
const ImgItemSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  isPrincipal: {
    type: Boolean,
    required: true,
  },
  tipoMedia: {
    type: Schema.Types.ObjectId,
    ref: "TipoMedio",
    required: true
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: "Item",
    required: true
  },
  img: {
    type: String,
  },
  descripcion: {
    type: String,

  },
  idx: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
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

ImgItemSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('ImgItem', ImgItemSchema)
