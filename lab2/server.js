const { json } = require("body-parser");
const express = require("express");
const fs = require("fs");
const app = express();
const bodyParserForm = require("body-parser").urlencoded();
let settings = {
  idCounter: 1,
};
let books = [];

app.set("view engine", "ejs");

app.get("/home", function (req, res) {
  res.render("home.ejs");
});

//display all books
app.get("/allbooks", function (req, res) {
  let filteredBooks = books;
  if (req.query.q) {
    filteredBooks = books.filter(
      (book) =>
        book.Name.indexOf(req.query.q) > -1 ||
        book.Author.indexOf(req.query.q) > -1
    );
  }

  res.render("allbooks.ejs", { q: req.query.q, filteredBooks });
});

//add new book
app.get("/addbook", function (req, res) {
  res.render("addbook.ejs");
});
app.post("/addbook", bodyParserForm, function (req, res) {
  console.log(req.body);
  req.body.Id = settings.idCounter++;
  books.push(req.body);
  saveDataToFile();
  res.render("redirect.ejs");
});

//update book
app.get("/updatebook", function (req, res) {
  let book = books.find((book) => book.Id == req.query.Id);
  console.log(book);
  res.render("updatebook.ejs", { book });
});

app.post("/updatebook", bodyParserForm, function (req, res) {
  let book = books.find((book) => book.Id == req.body.Id);
  book.Name = req.body.Name;
  book.Author = req.body.Author;
  saveDataToFile();
  res.render("redirect.ejs");
});

//delete book
app.get("/deletebook", function (req, res) {
  let bookIndex = books.findIndex((book) => book.Id == req.query.Id);
  books.splice(bookIndex, 1);
  saveDataToFile();
  res.render("redirect.ejs");
});

//save data to a file
function saveDataToFile() {
  fs.writeFile("./books.json", JSON.stringify(books), function (err) {
    if (err) console.log(err);
  });

  fs.writeFile("./settings.json", JSON.stringify(settings), function (err) {
    if (err) {
      console.log(err);
    }
  });
}

//load data of a file
function loadDataFromFile() {
  fs.readFile("./books.json", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      books = JSON.parse(data);
    }
  });
  fs.readFile("./settings.json", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      settings = JSON.parse(data);
    }
  });
}

loadDataFromFile();

app.listen(8080);
