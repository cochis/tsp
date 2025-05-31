const { response } = require('express')
const bcrypt = require('bcryptjs')
const Shared = require('../models/shared')
const { generarJWT } = require('../helpers/jwt')
//getShareds Shared
const getShareds = async (req, res) => {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [shareds, total] = await Promise.all([
        Shared.find({})
            .sort({ nombre: 1 })
            .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
            .skip(desde)
            .limit(cant),
        Shared.countDocuments(),
    ])

    res.json({
        ok: true,
        shareds,
        uid: req.uid,
        total,
    })
}
const getAllShareds = async (req, res) => {
    const [shareds, total] = await Promise.all([
        Shared.find({})
            .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
            .sort({ nombre: 1 }),
        Shared.countDocuments(),
    ])

    res.json({
        ok: true,
        shareds,
        uid: req.uid,
        total,
    })
}

//crearShared Shared
const crearShared = async (req, res = response) => {
    const { email, password } = req.body

    const uid = req.uid

    campos = {
        ...req.body,
        usuarioCreated: req.body.usuarioCreated
    }



    try {


        const shared = new Shared({
            ...campos
        })


        await shared.save()


        res.json({
            ok: true,
            shared
        })
    } catch (error) {
        console.error('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...  revisar logs',
        })
    }
}

//actualizarShared Shared
const actualizarShared = async (req, res = response) => {
    //Validar token y comporbar si es el sshared
    const uid = req.params.id
    try {
        const sharedDB = await Shared.findById(uid)
        if (!sharedDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No exite un shared',
            })
        }
        const { password, google, email, ...campos } = req.body
        if (!sharedDB.google) {
            campos.email = email
        } else if (sharedDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'El shared de Google  no se puede actualizar',
            })
        }


        const sharedActualizado = await Shared.findByIdAndUpdate(uid, campos, {
            new: true,
        })
        res.json({
            ok: true,
            sharedActualizado,
        })
    } catch (error) {
        console.error('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        })
    }
}


const isActive = async (req, res = response) => {
    const uid = req.params.id
    try {
        const sharedDB = await Shared.findById(uid)
        if (!sharedDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No exite un shared',
            })
        }
        const campos = req.body
        campos.activated = !sharedDB.activated
        const sharedActualizado = await Shared.findByIdAndUpdate(uid, campos, {
            new: true,
        })
        res.json({
            ok: true,
            sharedActualizado,
        })
    } catch (error) {
        console.error('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        })
    }
}

const getSharedById = async (req, res = response) => {
    const uid = req.params.uid
    try {
        const sharedDB = await Shared.findById(uid)
        if (!sharedDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No exite un shared',
            })
        }
        res.json({
            ok: true,
            shared: sharedDB,
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        })
    }
}
const getSharedsByEmail = async (req, res = response) => {
    const email = req.params.email



    try {
        const sharedDB = await Shared.find({ usuarioCreated: email })
            .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


        if (!sharedDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No exite un salon',
            })
        }
        res.json({
            ok: true,
            shareds: sharedDB,
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        })
    }
}
const getSharedByFiestaBoleto = async (req, res = response) => {
    const fiesta = req.params.fiesta
    const boleto = req.params.boleto
    try {
        const sharedDB = await Shared.find({ fiesta: fiesta, boleto: boleto })
            .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')


        if (!sharedDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No exite un salon',
            })
        }
        res.json({
            ok: true,
            shareds: sharedDB,
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        })
    }
}

module.exports = {
    getShareds,
    crearShared,
    actualizarShared,
    isActive,
    getSharedById,
    getAllShareds,
    getSharedsByEmail,
    getSharedByFiestaBoleto

}
