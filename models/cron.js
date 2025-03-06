const { Schema, model } = require('mongoose')
const CronSchema = Schema({

  type: {
    type: String,
    required: true,
  },

  response: {
    type: Object
  },

  dateCreated: {
    type: Number,
    required: true,
    default: Date.now(),
  }

})

CronSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Cron', CronSchema)
