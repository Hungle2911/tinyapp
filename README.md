# TinyApp Project
Want to share funny dog videos on Youtube but your links are too long? Want to store all of your favorite links in one place so you visit it anywhere at anytime? Tinyapp is just the right app for you!
TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Tinyapp's main page"](./docs/Screenshot%202024-03-10%20at%201.44.15%20PM.png)
!["Tinyapp's new short link generate feature"](./docs/Screenshot%202024-03-10%20at%201.44.30%20PM.png)
!["Tinyapp's link editing features "](./docs/Screenshot%202024-03-10%20at%201.44.43%20PM.png)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## How To Use
### Register/Login
To initiate the link management features, users need to be logged in. To register, simply click on the "Register" or "Login" option at the top right, provide your email and password, and you'll be all set.

### Generating New Links
Navigate to either the "Create a New Short Link" option on the My URLs page or select "Create New URL" from the navigation bar. Enter the desired long URL to generate a shortened link.

### Editing or Removing Short Links
In the My URLs section, users can delete any link. Alternatively, click on "Edit" to update a link by entering a new long URL. The short URL remains the same but redirects to the updated long URL.

### Accessing Your Short Link
To reach it is by clicking "Edit" on a link and using the short URL provided.