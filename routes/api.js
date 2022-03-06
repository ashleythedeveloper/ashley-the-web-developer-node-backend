const express = require('express');
const multer = require("multer");
const path = require('path');

const signup = require('../controllers/signup');
const login = require('../controllers/login');
const jwt = require('../controllers/jwt');
const metaData = require('../controllers/metaData');
const contact = require('../controllers/contact');
const projects = require('../controllers/projects');

const router = express.Router();

// const fileUpload = multer({
//   dest: path.join(__dirname, "../", "images")
// });

router.post('/api/signup/', signup.Signup);
router.post('/api/login/', login.Login);
router.post('/api/auth/blacklist-token/', jwt.BlacklistTokens);
router.post('/api/contact-message/', contact.SendContactMessage);
router.get('/api/projects/', projects.GetProjects);
router.post('/api/project/', projects.GetProject);

router.get('/api/auth/is-user/', jwt.VerifyToken, (req,res,next) => {res.status(200).send({message:"Is logged in"})});

router.post('/api/get-page-metadata/', metaData.GetMetaData);

module.exports = router;