const validator = require('validator');
const DB = require('./database');
const bcrypt = require('bcrypt');
const JWT = require('./jwt');

exports.Login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const validateEmail = validator.isEmail(email);

  if (validateEmail) {
    const getUser = await DB.GetUser(email)
      .then(async (user) => {
        if (user.rows.length > 0) {
          const userObject = user.rows[0];
          const decryptedPassword = await bcrypt.compare(password, userObject.password)
          if (decryptedPassword) {
            const jwtObject = await JWT.CreateToken(userObject.id)
            res.cookie('jwt', jwtObject.token, { httpOnly: true, maxAge: jwtObject.expriry * 1000 })
            res.status(200)
            res.send({ message: 'Successfully logged in' })
          } else {
            return res.status(401).send({ message: "Invalid email or password." })
          }
        } else {
          return res.status(401).send({ message: "Invalid email or password." })
        }
      })
      .catch((err) => {
        return res.status(500).send({ message: "There has been an error with the server. \nPlease try again. \nIf the error persists, please contact support." })
      })
  } else {
    return res.status(422).send({ message: "Invalid email address. Please enter a valid email address" })
  }



};