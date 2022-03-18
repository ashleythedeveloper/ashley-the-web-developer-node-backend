const DB = require('../database');
const validate = require('validator');
const bcrypt = require('bcrypt');
const { InvalidUserInputError, InvalidDataTypeError, DatabaseError } = require('../errorMiddleware');


exports.Signup = async (req, res, next) => {

  const verifySignupFormDataExists = (signupFormData) => {
    if (!signupFormData.password) {
      throw new InvalidUserInputError("You are missing a password.");
    };
    if (!signupFormData.email) {
      throw new InvalidUserInputError("You are missing an email address.");
    };
    if (!signupFormData.userName) {
      throw new InvalidUserInputError("You are missing a username.");
    };
    if (!signupFormData.firstName) {
      throw new InvalidUserInputError("You are missing a first name.");
    };
    if (!signupFormData.lastName) {
      throw new InvalidUserInputError("You are missing a last name.");
    };
  };

  const normaliseFormEmail = (signupFormData) => {
    return signupFormData.email.toLowerCase();
  };

  const normaliseFormUsername = (signupFormData) => {
    return signupFormData.userName.replace(/ /g, '_').toLowerCase();;
  };

  const normaliseFormFistName = (signupFormData) => {
    return signupFormData.firstName[0].toUpperCase() + req.body.firstName.slice(1);
  };

  const normaliseFormLastName = (signupFormData) => {
    return signupFormData.lastName[0].toUpperCase() + req.body.lastName.slice(1);
  };


  const checkIfPasswordIsValid = async (signupFormData) => {
    const isPasswordValid = await validate.isStrongPassword(signupFormData.password, { minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0 })

    if (!isPasswordValid) {
      throw new InvalidDataTypeError(JSON.stringify({
        message: {
          errorType: "Password",
          errorField: "password",
          notificationType: "error",
          notificationTitle: "Error",
          notificationMessage: "Your password must be longer than 8 charaters. Please try again."
        }
      }));
    } else {
      return
    }
  };

  const checkIfEmailIsValid = async (signupFormData) => {
    const isEmailValid = await validate.isEmail(signupFormData.email);
    if (!isEmailValid) {
      throw new InvalidDataTypeError(JSON.stringify({
        message: {
          errorType: "Invalid Email",
          errorField: "email",
          notificationType: "error",
          notificationTitle: "Error",
          notificationMessage: "Invalid email address. Please enter a valid email address."
        }
      }))
    };
  };

  try {
    verifySignupFormDataExists(req.body);
    await checkIfPasswordIsValid(req.body);
    await checkIfEmailIsValid(req.body);

    const email = normaliseFormEmail(req.body);
    const userName = normaliseFormUsername(req.body);
    const firstName = normaliseFormFistName(req.body);
    const lastName = normaliseFormLastName(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const saveUser = await DB.SaveUser(userName, firstName, lastName, email, hashedPassword);
    if (saveUser.status === "User Saved") {
      return res.status(201).send(JSON.stringify({
        message: {
          errorType: "",
          errorField: "",
          notificationType: "success",
          notificationTitle: "",
          notificationMessage: "Your account has been created."
        }
      }, null, 4));
    }
    else if (saveUser.status === "User Exists") {
      if (saveUser.errorField === "Email") {
        throw new InvalidDataTypeError(JSON.stringify({
          message: {
            errorType: "User Exists",
            errorField: saveUser.errorField,
            notificationType: saveUser.messageType,
            notificationTitle: saveUser.messageTitle,
            notificationMessage: saveUser.message
          }
        }));
      } else {
        throw new InvalidDataTypeError(JSON.stringify({
          message: {
            errorType: "User Exists",
            errorField: saveUser.errorField,
            notificationType: saveUser.messageType,
            notificationTitle: saveUser.messageTitle,
            notificationMessage: saveUser.message
          }
        }));
      }
    } else {
      /* istanbul ignore next */
      throw new DatabaseError(JSON.stringify({
        message: {
          errorType: "Server Error",
          errorField: saveUser.errorField,
          notificationType: saveUser.messageType,
          notificationTitle: saveUser.messageTitle,
          notificationMessage: saveUser.message
        }
      }));
    }
  }
  catch (err) {
    return next(err);
  };
};

