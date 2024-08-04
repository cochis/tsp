const { Schema, model } = require('mongoose')
const TokenPushSchema = Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
  },
  tokenPush: {
    type: Object
  },
  fiestas: [{
    type: Schema.Types.ObjectId,
    ref: "Fiesta",
  }],

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

TokenPushSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('TokenPush', TokenPushSchema)
