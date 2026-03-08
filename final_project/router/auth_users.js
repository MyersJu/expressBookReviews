const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  const userMatches = users.filter((user) => user.username === username);
  return userMatches.length > 0; 
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

// 7 only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

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
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// 8 Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  const { review } = req.body; 
  
  if (!books[ISBN]) {
    return res.status(404).json({ message: "ISBN not found" });
  }

  if (!review || review.trim() === "") {
    return res.status(400).json({ message: "Review cannot be empty" });
  }

  const user = req.session.authorization.username;
  books[ISBN].reviews[user] = review;

  return res.status(200).json({
    message: "Review successfully added",
    book: books[ISBN]
  });
});

// 9 Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
      let book = books[isbn];
      delete book.reviews[username];
      return res.status(200).send("Review successfully deleted");
  }
  else {
      return res.status(404).json({message: `ISBN ${isbn} not found`});
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
