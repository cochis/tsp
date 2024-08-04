const { Schema, model } = require('mongoose')
const PushSchema = Schema({
  endpoint: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: String 
  },
  keys: {
       
      type: Object,
      required: true,
  
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

PushSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Push', PushSchema)
