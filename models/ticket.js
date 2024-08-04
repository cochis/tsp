const { Schema, model } = require('mongoose')
const TicketSchema = Schema({
  fiesta: {
    type: Schema.Types.ObjectId,
    ref: "Fiesta",
  },
  tipoEvento: {
    type: Schema.Types.ObjectId,
    ref: "TipoEvento",
  },
  tipoGrupo: {
    type: Schema.Types.ObjectId,
    ref: "TipoGrupo",
  },
  grupoNombre: {
    type: String,
    required: true
  },
  mesa: {
    type: String
  },
  img: {
    type: String
  },
  cantidad: {
    type: Number,
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

TicketSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Ticket', TicketSchema)
