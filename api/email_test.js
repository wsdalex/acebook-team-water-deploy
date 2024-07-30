require('dotenv').config();

// TODO - Create an email class wrapper.

console.log('Email test');

const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const secret = process.env.EMAIL_SERVICE;
const sender_address = "do_not_reply@trial-7dnvo4drkr9g5r86.mlsender.net"

const mailerSend = new MailerSend({
    apiKey: secret,
});

// process.env.API_KEY

const sentFrom = new Sender(sender_address, "Acebook");

const recipients = [
  new Recipient("reza@jugon.com", "Acebook user")
];

const emailParams = new EmailParams()
  .setFrom(sentFrom)
  .setTo(recipients)
  .setReplyTo(sentFrom)
  .setSubject("Acebook notification")
  .setHtml("<strong>This is the HTML content</strong>")
  .setText("This is the text content");


mailerSend.email.send(emailParams)
  .then(response => {
    // Handle successful response
    console.log("Email sent successfully:", response);
  })
  .catch(error => {
    // Handle error
    console.error("Error sending email:", error);
  });

//Above was more mailer send.. now mailgun

