const { Schema, model } = require('mongoose')
const LogSchema = Schema({
 
   
  url: {
    type: String
  },
  method: {
    type: String
  },
   
  queryParams: {
    type: String
  },
  request: {
    type: Object
  },
  response: {
    type: Object
  },
  statusCode: {
    type: Number
  },
  
  usuarioCreated: {
    type:String
    
  },
 
    activated: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Number,
    default: Date.now(),
  },
})

LogSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Log', LogSchema)
