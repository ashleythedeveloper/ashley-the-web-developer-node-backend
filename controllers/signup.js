const DB = require('./database');
const validate = require('validator');
const bcrypt = require('bcrypt');


exports.Signup = async (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  const userName = req.body.userName.replace(/ /g, '_').toLowerCase();
  const firstName = req.body.firstName[0].toUpperCase() + req.body.firstName.slice(1);
  const lastName = req.body.lastName[0].toUpperCase() + req.body.lastName.slice(1);

  try {
    const isEmailValid = await validate.isEmail(email)
    if (!isEmailValid) {
      return res.status(422).send({
        errorType: "Invalid Email",
        errorField: "email",
        notificationType: "error",
        notificationTitle: "Error",
        notificationMessage: "Invalid email address. Please enter a valid email address."
      })
    }

    const isPasswordValid = await validate.isStrongPassword(req.body.password, { minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0 })
    if (!isPasswordValid) {
      return res.status(422).send({
        errorType: "Password",
        errorField: "password",
        notificationType: "error",
        notificationTitle: "Error",
        notificationMessage: "Your password must be longer than 8 charaters. Please try again."
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const saveUser = await DB.SaveUser(userName, firstName, lastName, email, hashedPassword);
    if (saveUser.status === "User Saved") {
      return res.status(201).send({
        errorType: "",
        errorField: "",
        notificationType: "success",
        notificationTitle: "",
        notificationMessage: "Your account has been created."
      })
    } else if (saveUser.status === "User Exists") {
      if (saveUser.errorField === "Email") {
        return res.status(422).send({
          errorType: "User Exists",
          errorField: saveUser.errorField,
          notificationType: saveUser.messageType,
          notificationTitle: saveUser.messageTitle,
          notificationMessage: saveUser.message
        })
      } else {
        return res.status(422).send({
          errorType: "User Exists",
          errorField: saveUser.errorField,
          notificationType: saveUser.messageType,
          notificationTitle: saveUser.messageTitle,
          notificationMessage: saveUser.message
        })
      }
    } else {
      return res.status(500).send({
        errorType: "Server Error",
          errorField: saveUser.errorField,
          notificationType: saveUser.messageType,
          notificationTitle: saveUser.messageTitle,
          notificationMessage: saveUser.message
      })
    }
  } catch {
    return res.status(500).send({
      errorType: "Server Error",
      errorField: "",
      notificationType: "error",
      notificationTitle: "Server Error",
      notificationMessage: "There has been an error with our server. If the problem persists, please contact support."
    })
  }
}

