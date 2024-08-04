const { Schema, model } = require('mongoose')
const EmailSchema = Schema({
  to: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  fiesta: {
    type: Schema.Types.ObjectId,
    ref: "Fiesta",
    required: true,
  },
  boleto: {
    type: Schema.Types.ObjectId,
    ref: "Boleto",
    required: true,
  },
  body: {
    type: String,
    required: true,
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

EmailSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Email', EmailSchema)
