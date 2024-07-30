# MailerSend
https://github.com/mailersend/mailersend-nodejs

## Important
This is using Reza's API key and the number of emails that can be sent is restricted.
We don't have a sending domain registered, so sending emails to icloud (as an example will fail)
This seems to work where the recipient is a Google mail user.

## Installation

The command below will let you use read from .env files
- npm install dotenv --save

    cd api
    npm install mailersend
- Put the following into /api/.env
    EMAIL_SERVICE = "INSERT_SPECIAL_KEY"


## How to run

Execute the following:
    node email_test.js 

