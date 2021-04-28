require('dotenv').config();
const nodemailer = require('nodemailer')

const sendMail = (recieverEmail, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_EMAIL_PASSWORD,
    },
  });
  
  const options = {
      from: process.env.SENDER_EMAIL,
      to: `${recieverEmail}`,
      subject: `${subject}`,
      text: `${text}`
  }
  
  transporter.sendMail(options, function(err, info){
      if(err){
          console.log(err);
          return
      }
      console.log("Send" + info.response)
  })
}

module.exports = sendMail