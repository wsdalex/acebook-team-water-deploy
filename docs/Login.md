# Login notes


## User stories

- As an end user, I'd like to create an account by specifying my email address and a user defined password.
- As an end user, I would like to be able to log into the service using my Google/Apple account.
- As an end user, I'd like a simple and clear sign up and login form to fill in.
- As an end user, if I experience an 'error', I'd like a clear and simple notification through my browser (log outs are currently reported in the console)
- As an end user, I'd like the ability to sign out of the app when I'm finished.

## Design considerations

- Sign up and Login are linked from the main page
- ~~These two options could be placed on the same 'welcome screen'~~
- Basic validation for the email address and password should be in place - this is currently a gap so we'll need to include some validation checks. These checks would ideally be done on the frontend using React (upon data entry).
- The current form is bland needs some improved look and feel.
- I'm not sure how the login.jsx uses a 'token' based service to authenticate and login users?
- ~~Need to trap the logout event and display a suitable message for the end user to login~~.

