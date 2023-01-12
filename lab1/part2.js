const express = require("express");
const bodyParser = require("body-parser").urlencoded();
const myApp = express();
myApp.get("/home", (req, res) => {
  res.sendFile(__dirname + "/pages/home.html");
});
myApp.get("/about", (req, res) => {
  res.sendFile(__dirname + "/pages/about.html");
});
myApp.get("/contact", (req, res) => {
  res.sendFile(__dirname + "/pages/contact.html");
});
myApp.post("/login", bodyParser, (req, res) => {
  console.log(req.body);
  if (req.body.password.length < 8) {
    res.send(
      "<h1 style='color:red;'> Error password is less than 8 characters</h1>"
    );
  } else {
    res.send("<h1 style='color:green;'> Registration success</h1>");
  }
});

myApp.listen(8080);
