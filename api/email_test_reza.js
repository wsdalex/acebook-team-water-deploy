require('dotenv').config();

console.log('email test');

// TODO Use .env file later on.
//import 'dotenv/config';
//import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const secret = process.env.EMAIL_SERVICE;

const mailerSend = new MailerSend({
    apiKey: secret,
});

// process.env.API_KEY

const sentFrom = new Sender("fake@trial-7dnvo4drkr9g5r86.mlsender.net", "Reza J");

const recipients = [
  new Recipient("rezajugon@icloud.com", "Your Client")
];

const emailParams = new EmailParams()
  .setFrom(sentFrom)
  .setTo(recipients)
  .setReplyTo(sentFrom)
  .setSubject("This is a Subject")
  .setHtml("<strong>This is the HTML content</strong>")
  .setText("This is the text content");

//await mailerSend.email.send(emailParams);

mailerSend.email.send(emailParams)
  .then(response => {
    // Handle successful response
    console.log("Email sent successfully:", response);
  })
  .catch(error => {
    // Handle error
    console.error("Error sending email:", error);
  });