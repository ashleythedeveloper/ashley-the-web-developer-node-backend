const express = require('express');

const signup = require('../controllers/signup/signup');
const login = require('../controllers/login');
const jwt = require('../controllers/jwt');
const metaData = require('../controllers/metaData');
const contact = require('../controllers/contact');
const projects = require('../controllers/projects');

const router = express.Router();

router.post('/api/signup/', signup.Signup);
router.post('/api/login/', login.Login);
router.post('/api/auth/blacklist-token/', jwt.BlacklistTokens);
router.post('/api/contact-message/', contact.SendContactMessage);
router.get('/api/projects/', projects.GetProjects);
router.post('/api/project/', projects.GetProject);
router.post('/api/update-project/', jwt.VerifyToken, projects.UpdateProject);
router.post('/api/users-project/', jwt.VerifyToken, projects.GetProject)

router.get('/api/auth/is-user/', jwt.VerifyToken, (req,res) => {res.status(200).send({message:"Is logged in"})});

router.post('/api/get-page-metadata/', metaData.GetMetaData);

module.exports = router;