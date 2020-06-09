# node-react-jwt-auth

Sample web app to demonstrate how learn to add JWT authentication to a project using Node.js, Typescript, GraphQL, React, and PostgreSQL, and Docker.

## To use this sample:

1. Clone this repo `git clone https://github.com/jtobin321/node-react-jwt-auth.git`
2. Start up the back-end server:
    * `cd server`
    * Build the api image locally: `docker build -t node-react-jwt-auth`
    * start the api and database containers locally: `docker-compose up`
3. Start the front-end:
    * `cd ../web && npm install`
    * `npm start`
