const { Schema, model } = require('mongoose')

const ProveedorSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  clave: {
    type: String,
    required: true,
  },
  bannerImg: {
    type: String,

  },
  img: {
    type: String,

  },
  calificacion: [{
    calificacionOrden: {
      type: String,
      default: null
    }
  }

  ],
  descripcion: {
    type: String
  },
  redes: [{
    red: {
      type: Schema.Types.ObjectId,
      ref: "Red",
    },
    value: {
      type: String
    },
  }],
  contactos: [{
    tipoContacto: {
      type: Schema.Types.ObjectId,
      ref: "TipoContacto",
    },
    value: {
      type: String
    },
  }],
  colores: [{
    tipoColor: {
      type: Schema.Types.ObjectId,
      ref: "TipoColor",
    },
    value: {
      type: String
    },
  }],
  ubicacion: {
    type: String,

  },
  lng: {
    type: Number,

  },
  lat: {
    type: Number,

  },
  ubicaciones: [{
    type: Schema.Types.ObjectId,
    ref: "Salon",
    required: true
  }],
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

ProveedorSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Proveedor', ProveedorSchema)
