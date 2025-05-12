const { Schema, model } = require('mongoose')
const SharedSchema = Schema({
    type: {
        type: String,
        required: true,
    },
    fiesta: {
        type: Schema.Types.ObjectId,
        ref: "Fiesta",
        required: true
    },
    boleto: {
        type: Schema.Types.ObjectId,
        ref: "Boleto",
        required: true
    },
    data: {
        type: Object,
        required: true,
    },
    compartidas: {
        type: Number,
        default: 0
    },
    vistas: {
        type: Number,
        default: 0
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

SharedSchema.method('toJSON', function () {
    const { __v, _id, password, ...object } = this.toObject()
    object.uid = _id
    return object
})
module.exports = model('Shared', SharedSchema)
