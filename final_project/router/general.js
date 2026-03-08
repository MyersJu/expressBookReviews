const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// 6
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password) {
      if(!doesExist(username)) {
        let user = {"username": username, "password": password};
        users.push(user);
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists! Choose another username"});
      }
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// 1 Get the book list available in the shop
public_users.get('/',function (req, res) {
  if (books) {
    return res.status(200).send(JSON.stringify(books, null, 4));
  } else {
    return res.status(404).json({ message: "No books in the shop" });
  }
});

// 2 Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;

  if (books[ISBN]) {
    return res.status(200).send(books[ISBN]);
  } else {
    return res.status(404).json({ message: "ISBN not found" });
  }
 });
  
// 3 Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  
  const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase().includes(author));

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "Author not found" });
  }
});

// 4 Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(title));

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "Title not found" });
  }
});

//  5 Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn; 

  const book = books[ISBN];
  if (!book) {
    return res.status(404).json({ message: "ISBN not found" });
  }

  if (Object.keys(book.reviews).length === 0) {
    return res.status(404).json({ message: "No reviews for this book" });
  }

  return res.status(200).json({ reviews: book.reviews });
});

module.exports.general = public_users;
