const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });
      get_books.then((resp) => res.send(JSON.stringify(resp,null,4)));
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const get_book = new Promise((resolve, reject) => {
        resolve(res.send(books[isbn]));
      });
      get_book.then((resp) => res.send(JSON.stringify(resp,null,4)));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const book = Object.values(books).find(book => book.author === author);
    const get_book = new Promise((resolve, reject) => {
       resolve(res.send(book));
      });
      get_book.then((resp) => res.send(resp));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const book = Object.values(books).find(book => book.title === title);
    const get_book = new Promise((resolve, reject) => {
       resolve(res.send(book));
      });
      get_book.then((resp) => res.send(resp));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const reviews = books[isbn] ? books[isbn].reviews : {}
    res.send(reviews)
});

module.exports.general = public_users;
