const { Schema, model } = require('mongoose')
const StripeSchema = Schema({
  ui_mode: {
    type: String,
    required: true,
  },
  line_items: [{
    price: {
      type: String
    },
    quantity: {
      type: String
    }
  }],
  mode: {
    type: String,
    required: true,
  },
  return_url: {
    type: String,
    required: true,
  },

})

StripeSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Stripe', StripeSchema)
