const express = require("express");
let books = require("./booksdb.js");

let users = require("./auth_users.js").users;
const public_users = express.Router();

const isValid = (username) => {
  //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  let username = req.query.username;
  let password = req.query.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  if (books[req.params.isbn]) {
    return res.status(200).json(books[req.params.isbn]);
  }
  res.send("Response about ISBN " + req.params.isbn);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let keys = Object.keys(books);
  for (let i = 1; i < keys.length; i++) {
    if (books[i].author == req.params.author) {
      res.send(books[i]);
    }
  }
  res.send("No books found for author " + req.params.author);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let keys = Object.keys(books);
  for (let i = 1; i < keys.length; i++) {
    if (books[i].title == req.params.title) {
      res.send(books[i]);
    }
  }
  res.send("No books found for title " + req.params.title);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  if (books[req.params.isbn]) {
    return res.status(200).json(books[req.params.isbn].reviews);
  }
  res.send("ISBN not found " + req.params.isbn);
});

module.exports.general = public_users;
