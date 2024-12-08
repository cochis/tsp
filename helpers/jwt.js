const jwt = require('jsonwebtoken')

const generarJWT = (usuario) => {
  usuario.compras = undefined
  return new Promise((resolve, reject) => {
    const payload = {
      usuario,
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: '8h',
      },
      (err, token) => {
        if (err) {
          console.error('err::: ', err);

          reject('No se pudo generar el JWT')
        } else {
          resolve(token)
        }
      },
    )
  })
}

module.exports = {
  generarJWT,
}
