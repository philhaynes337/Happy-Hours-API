Happy-Hours-API
=================
[Click here](https://happyhours-two.vercel.app/ "Happy Hours") to visit the live app!
-----------------

Demo User Info
-
Username: demo
-
Password: demo
-----------------
Endpoints
-
/create
This endpoint takes the users information after the user creates an account and supplies it to the database. It also hashs with a hash word so the password is encrypted.
-
/authentication
This endpoint checks when the user signs in if the user is authenticated. It also provides the user with a token and gives the same token to the database. When the user logs out the token is deleted in both locations.
-
/success
This endpoint supplies the user with their information. It also lets them add / edit / and delete their information.
-


-----------------
Technology Used
-----------------
This app was created using JavaScript, knex, cors, express, jsonwebtoken, bcryptjs, and postgres.
-----------------
