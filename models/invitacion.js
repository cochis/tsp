const { Schema, model } = require('mongoose')
const InvitacionSchema = Schema({
  fiesta: {
    type: Schema.Types.ObjectId,
    ref: "Fiesta",
    required: true
  },

  data: {
    type: Object
  },
  tipoTemplate: {
    type: String,
    required: true
  },
  usuarioFiesta: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  templateActivated: {
    type: Boolean,
    required: true
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

InvitacionSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Invitacion', InvitacionSchema)
