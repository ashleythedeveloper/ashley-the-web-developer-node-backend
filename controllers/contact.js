const NodeMailer = require('nodemailer');


// Send emails
const SendMail = exports.SendMail = async (mailObject) => {
  const transporter = NodeMailer.createTransport({
    service: process.env.MAILPROVIDER,
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASSWORD
    }
  });
  
  const sendTheMail = transporter.sendMail(mailObject)
  .then((res) => {
    return true;
  })
  .catch((err) => {
    return false;
  })
  
  return sendTheMail
};


exports.SendContactMessage = async (req, res) => {

  // Send the contact email
  const sendContactEmail = await SendMail({
    from: 'ashley@ashleythewebdeveloper.com.au',
    to: 'ashley@ashleythewebdeveloper.com.au',
    subject: 'You have a new message - Ashley The Web Developer',
    html: `<p>Name: ${req.body.firstName} ${req.body.lastName}</p>
            <p>Email: ${req.body.email}</p>
            <p>Message: ${req.body.message}</p>`
  })
  console.log(sendContactEmail)
  if (sendContactEmail) {
    return res.status(200).send({
      errorType: '',
      errorField: '',
      notificationType: 'success',
      notificationTitle: '',
      notificationMessage: 'Your message was sent.'
    })
  } else {
    return res.status(500).send({
      errorType: 'Message Failed',
      errorField: '',
      notificationType: 'error',
      notificationTitle: 'Error',
      notificationMessage: 'Your message failed to send. Please try again.'
    })
  }
}