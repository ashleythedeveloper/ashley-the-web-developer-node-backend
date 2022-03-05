const validator = require('validator');
const DB = require('./database');
const bcrypt = require('bcrypt');
const JWT = require('./jwt');

exports.Login = async (req, res, next) => {

  const incorrectCredentialsResponseObject = {
    errorType: "Invalid Username or Password",
    errorField: "Email & Password",
    notificationType: 'error',
    notificationTitle: 'Error',
    notificationMessage: 'Invalid username or password. Please try again or sign up.'
  }
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
            res.status(200).send({
              status: "User Logged In",
              errorField: "",
              messageType: "success",
              messageTitle: "",
              message: ""
            })
          } else {
            return res.status(401).send(incorrectCredentialsResponseObject)
          }
        } else {
          return res.status(401).send(incorrectCredentialsResponseObject)
        }
      })
      .catch((err) => {
        return res.status(500).send({
          status: "Server Error",
          errorField: "",
          messageType: "error",
          messageTitle: "Server Error",
          message: "There has been an error with the server. \nPlease try again. \nIf the error persists, please contact support."
        })
      })
  } else {
    return res.status(422).send({
      status: "Server Error",
      errorField: "",
      messageType: "error",
      messageTitle: "Server Error",
      message: "Invalid email address. Please enter a valid email address"
    })
  }



};