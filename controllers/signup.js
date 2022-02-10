const DB = require('./database');
const validate = require('validator');
const bcrypt = require('bcrypt');


exports.Signup = async (req, res, next) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const userName = req.body.userName.replace(/ /g, '_').toLowerCase();
    const firstName = req.body.firstName[0].toUpperCase() + req.body.firstName.slice(1);
    const lastName = req.body.lastName[0].toUpperCase() + req.body.lastName.slice(1);

    const isEmailValid = await validate.isEmail(email)
    if (!isEmailValid) {
      return res.status(422).send({errorType: "email", message: "Invalid email address. Please enter a valid email address."})
    }

    const isPasswordValid = await validate.isStrongPassword(req.body.password, {minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0})
    if (!isPasswordValid) {
      return res.status(422).send({errorType: "password", message: "Your password must be longer than 8 charaters. Please enter a longer password."});
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const saveUser = await DB.SaveUser(userName, firstName, lastName, email, hashedPassword);
    console.log(saveUser)
    if (saveUser.status === "User Saved") {
      return res.status(201).send({message: saveUser.message})
    } else if (saveUser.status === "User Exists") {
      return res.status(422).send({errorType:saveUser.status, field:saveUser.field, message: saveUser.message})
    } else {
      return res.status(500).send({errorType:saveUser.status, message: saveUser.message})
    }
    return res.status(500).send({message: "There has been an error. Please try sigining up again. If the problem persists, please contact support."})
  }
 
