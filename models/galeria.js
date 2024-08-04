const { Schema, model } = require('mongoose')
const GaleriaSchema = Schema({

  fiesta: {
    type: Schema.Types.ObjectId,
    ref: "Fiesta",
  },
  boleto: {
    type: Schema.Types.ObjectId,
    ref: "Boleto",
  },


  img: {
    type: String,
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

GaleriaSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Galeria', GaleriaSchema)
