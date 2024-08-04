const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
dbConnection().catch((err) => console.error(err))
async function dbConnection() {
  try {
    await mongoose.connect(process.env.DB_CNNLocal, { dbName: 'TicketDB' })
    console.info('DB Online')
  } catch (error) {
    console.error('error::: ', error);

    throw new Error('Error a la hora de iniciar la BD ver logs')
  }
}

module.exports = {
  dbConnection,
}
