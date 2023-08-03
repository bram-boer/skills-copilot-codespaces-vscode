// create webserver
// create a route for POST /comments
// use body-parser to parse the body of the request
// send back a response with a JSON payload
// the payload should be the same as the request body
// start the server and test with Postman

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const PORT = 3000;

app.use(bodyParser.json());

app.post('/comments', (req, res) => {
  const { body } = req;
  res.json(body);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});