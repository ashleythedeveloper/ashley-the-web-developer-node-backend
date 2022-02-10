const jwt = require('jsonwebtoken');
const validateToken = require('validator').isJWT

exports.CreateToken = async (userId) => {
  const maxAge = 3 * 24 * 60 * 60;
  const token = jwt.sign({userId: userId}, process.env.JWTSECRET, {expiresIn: maxAge});
  return {token: token, expriry: maxAge}
};

exports.VerifyToken = async (req, res, next) => {
  if (!req.cookies.jwt) {
    return res.status(401).send({message: 'Unauthorised. Please login or signup.'})
  };

  const isJWTToken = await validateToken(req.cookies.jwt)

  if (isJWTToken) {
    try {
      const verifiedToken = jwt.verify(req.cookies.jwt, process.env.JWTSECRET)
      res.locals.decodedToken = verifiedToken
      next()

    } catch {
      return res.status(401).send({message: 'Unauthorised. Please login or signup.'})
    }

  } else {
    return res.status(401).send({message: "Invalid JWT Token"})
  }
};

exports.DecodeToken = async (req, res, next) => {
  const isJWTToken = await validateToken(req.cookies.jwt)

  if (isJWTToken) {
    const verifiedToken = jwt.verify(req.cookies.jwt, process.env.JWTSECRET)
    return verifiedToken
  } else {
    return res.status(422).send({message: "Invalid JWT Token"})
  }
};


