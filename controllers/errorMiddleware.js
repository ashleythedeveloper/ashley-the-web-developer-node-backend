

class InvalidUserInputError extends Error {
  constructor(message) {
    super(message)
    this.message = message;
    this.name = "InvalidUserInputError";
  }
}



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
        }}, null, 4))
  };
 
};



module.exports = {
  errorMiddleware: errorMiddleware,
  InvalidUserInputError : InvalidUserInputError
}