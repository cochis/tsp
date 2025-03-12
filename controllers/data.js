const { response } = require('express')
const Boleto = require('../models/boleto')
const Fiesta = require('../models/fiesta')
const Galeria = require('../models/galeria')
const Invitacion = require('../models/invitacion')
const Salon = require('../models/salon')
const Push = require('../models/push')
const Template = require('../models/template')
const Ticket = require('../models/ticket')
const Usuario = require('../models/usuario')
const Calificacion = require('../models/calificacion')
const CategoriaItem = require('../models/categoriaItem')
const Compra = require('../models/compra')
const Contacto = require('../models/contacto')
const Item = require('../models/item')
const Cotizacion = require('../models/cotizacion')
const Ejemplo = require('../models/ejemplo')
const Email = require('../models/email')
const EstatusCotizacion = require('../models/estatusCotizacion')
const Evento = require('../models/evento')
const Grupo = require('../models/grupo')
const ImgItem = require('../models/imgItem')
const Proveedor = require('../models/proveedor')
const Paquete = require('../models/paquete')
const StatusCompra = require('../models/statusCompra')
const delDataByUsr = async (req, res) => {
  const id = req.params.id

  try {
    const usuarioDB = await Usuario.find({ email: id })

    if (usuarioDB.length == 0) {
      return res.status(200).json({
        ok: false,
        msg: 'Ya no hay datos',
      })
    }

    const boletoDBDel = await Boleto.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const fiestaDBDel = await Fiesta.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const galeriaDBDel = await Galeria.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const invitacionsDBDel = await Invitacion.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const pushDBDel = await Push.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const salonDBDel = await Salon.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const templateDBDel = await Template.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const ticketsDBDel = await Ticket.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const usuariosDBDel = await Usuario.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const usuarioDBDel = await Usuario.deleteMany({ _id: usuarioDB[0]._id }, { new: true })
    const calificacionDBDel = await Calificacion.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const categoriaItemDBDel = await CategoriaItem.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const comprasItemDBDel = await Compra.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const contactosItemDBDel = await Contacto.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const itemsItemDBDel = await Item.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const cotizacionsItemDBDel = await Cotizacion.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const ejemplosItemDBDel = await Ejemplo.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const emailsItemDBDel = await Email.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const estatusItemDBDel = await EstatusCotizacion.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const eventosItemDBDel = await Evento.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const gruposItemDBDel = await Grupo.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const imgItemsItemDBDel = await ImgItem.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const proveedorsItemDBDel = await Proveedor.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const paquestesItemDBDel = await Paquete.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })
    const statusCompraItemDBDel = await StatusCompra.deleteMany({ usuarioCreated: usuarioDB[0]._id }, { new: true })

    res.json({
      ok: true,
      boletos: boletoDBDel,
      fiestas: fiestaDBDel,
      galerias: galeriaDBDel,
      invitaciones: invitacionsDBDel,
      pushes: pushDBDel,
      salones: salonDBDel,
      templates: templateDBDel,
      tickets: ticketsDBDel,
      usuarios: usuariosDBDel,
      usuario: usuarioDBDel,
      calificaciones: calificacionDBDel,
      categoriasItems: categoriaItemDBDel,
      compras: comprasItemDBDel,
      contactos: contactosItemDBDel,
      items: itemsItemDBDel,
      cotizaciones: cotizacionsItemDBDel,
      ejemplos: ejemplosItemDBDel,
      emails: emailsItemDBDel,
      estaus: estatusItemDBDel,
      eventos: eventosItemDBDel,
      grupos: gruposItemDBDel,
      imgItems: imgItemsItemDBDel,
      proveedores: proveedorsItemDBDel,
      paquetes: paquestesItemDBDel,
      estuscompra: statusCompraItemDBDel,

    })




  } catch (error) {
    console.error('error::: ', error);

  }

}



module.exports = {
  delDataByUsr,


}
