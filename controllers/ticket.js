const { response } = require('express')
const bcrypt = require('bcryptjs')
const Ticket = require('../models/ticket')
const { generarJWT } = require('../helpers/jwt')
//getTickets Ticket
const getTickets = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [tickets, total] = await Promise.all([
    Ticket.find({})
      .sort({ nombre: 1 })
      .populate('ticketCreated', 'nombre , email')
      .skip(desde)
      .limit(cant),
    Ticket.countDocuments(),
  ])

  res.json({
    ok: true,
    tickets,
    uid: req.uid,
    total,
  })
}
const getAllTickets = async (req, res) => {
  const [tickets, total] = await Promise.all([
    Ticket.find({})
      .sort({ nombre: 1 }),
    Ticket.countDocuments(),
  ])

  res.json({
    ok: true,
    tickets,
    uid: req.uid,
    total,
  })
}
//crearTicket Ticket
const crearTicket = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }
  try {


    const ticket = new Ticket({
      ...campos
    })


    await ticket.save()


    res.json({
      ok: true,
      ticket
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}
//actualizarTicket Ticket
const actualizarTicket = async (req, res = response) => {
  //Validar token y comporbar si es el sticket
  const uid = req.params.id
  try {
    const ticketDB = await Ticket.findById(uid)
    if (!ticketDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un ticket',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!ticketDB.google) {
      campos.email = email
    } else if (ticketDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El ticket de Google  no se puede actualizar',
      })
    }


    const ticketActualizado = await Ticket.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      ticketActualizado,
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
    const ticketDB = await Ticket.findById(uid)
    if (!ticketDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un ticket',
      })
    }
    const campos = req.body
    campos.activated = !ticketDB.activated
    const ticketActualizado = await Ticket.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      ticketActualizado,
    })
  } catch (error) {
    console.error('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}
const getTicketById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const ticketDB = await Ticket.findById(uid)
    if (!ticketDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un ticket',
      })
    }
    res.json({
      ok: true,
      ticket: ticketDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}
module.exports = {
  getTickets,
  getAllTickets,
  crearTicket,
  actualizarTicket,
  isActive,
  getTicketById,

}
