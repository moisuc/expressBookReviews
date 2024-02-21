const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res
      .status(200)
      .send(
        "User successfully logged in " + req.session.authorization.username
      );
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.query.review;
  if (isbn && review) {
    if (!books[isbn]) {
      return res.status(404).json({ message: "ISBN not found" });
    }
    if (books[isbn].reviews[req.session.authorization.username]) {
      books[isbn].reviews[req.session.authorization.username] = review;
    } else {
      books[isbn].reviews[req.session.authorization.username] = [];
      books[isbn].reviews[req.session.authorization.username].push(review);
    }
    return res.status(200).json({ message: "Review added successfully" });
  }
  return res.status(404).json({ message: "Unable to add review" });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  if (isbn) {
    if (!books[isbn]) {
      return res.status(404).json({ message: "ISBN not found" });
    }
    if (books[isbn].reviews[req.session.authorization.username]) {
      delete books[isbn].reviews[req.session.authorization.username];
      return res.status(200).json({ message: "Review deleted successfully" });
    }
  }
  return res.status(404).json({ message: "Unable to delete review" });
});
module.exports.authenticated = regd_users;

module.exports.users = users;
