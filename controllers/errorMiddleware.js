

class InvalidUserInputError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "InvalidUserInputError";
  };
};

class InvalidDataTypeError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "InvalidDataTypeError";

  };
};

class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'DatabaseError';
  };
};


const errorMiddleware = (err, req, res, next) => {

  if (err instanceof InvalidUserInputError) {
    return res.status(422).send(JSON.stringify({
      message: `Invalid signup form structure. ${err.message} See the expected structure below.`,
      expectedFormStructure: {
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: ''
      }
    }, null, 4))
  };

  if (err instanceof InvalidDataTypeError) {
    return res.status(422).send(err.message);
  };

  if (err instanceof DatabaseError) {
    res.status(500).send(err.message);
  } else {
    return res.status(500).send(JSON.stringify({
      errorType: "Server Error",
      errorField: "",
      notificationType: "error",
      notificationTitle: "Server Error",
      notificationMessage: "There has been an error with our server. If the problem persists, please contact support."
    }))
  }
};



module.exports = {
  errorMiddleware,
  InvalidUserInputError,
  InvalidDataTypeError,
  DatabaseError
}