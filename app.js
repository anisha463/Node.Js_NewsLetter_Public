const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { urlencoded } = require("body-parser");
require("dotenv").config();
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
  const name = req.body.name;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: { FNAME: name, LNAME: lastName },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = process.env.API_MAILCHIMP;
  const options = {
    method: "POST",
    auth: process.env.API_AUTH_KEY,
  };
  const requesting = https.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
      const newData = JSON.parse(data);

      if (response.statusCode === 200) {
        if (newData.new_members.length === 0) {
          res.sendFile(__dirname + "/failure.html");
        } else {
          res.sendFile(__dirname + "/success.html");
        }
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  requesting.write(jsonData);
  requesting.end();
});
app.listen(port, function () {
  console.log("listening to 3000");
});
