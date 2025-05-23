const { response } = require('express')
const bcrypt = require('bcryptjs')
const Chatbot = require('../models/chatbot')
const { generarJWT } = require('../helpers/jwt')

const axios = require('axios');
//crearChatbot Chatbot


const crearChatbot = async (req, res) => {
  const { message, open } = req.body;
  console.log('message::: ', message);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'Eres un asistente amigable y profesional de MyTicketParty. Ayudas a los usuarios con dudas sobre invitaciones digitales para eventos como XV años, bodas, cumpleaños, etc.',
          },
          { role: 'user', content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${open}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ response: response.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error en el chatbot' });
  }
}


module.exports = {
  crearChatbot,

}
