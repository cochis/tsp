const { Schema, model } = require('mongoose')
const ItemSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  proveedor: {
    type: Schema.Types.ObjectId,
    ref: "Proveedor",
    required: true
  },
  tipoItem: {
    type: Schema.Types.ObjectId,
    ref: "TipoItem",
    required: true
  },
  categoriaItem: {
    type: Schema.Types.ObjectId,
    ref: "CategoriaItem",
    required: true
  },
  isSelectedBy: {
    type: String,
  },
  isBySize: {
    type: Boolean,
    default: false
  },
  isByService: {
    type: Boolean,
    default: false
  },
  isByColor: {
    type: Boolean,
    default: false
  },
  isByCantidad: {
    type: Boolean,
    default: false
  },
  sizes: [{
    type: Object
  }],
  colores: [{
    type: Object
  }],
  servicios: [{
    type: Object
  }],
  cantidades: [{
    type: Object
  }],
  photos: [{
    type: Object
  }],
  descripcion: {
    type: String,
    required: true,
  },
  idealTo: [{
    type: Object
  }],
  calificacion: {
    type: Number,
    default: 0
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

ItemSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Item', ItemSchema)
