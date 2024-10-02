const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const  username=req.body.username;
  const  password=req.body.password;

  if (username && password) {
    // Check if the user does not already exist
    if (isValid(username)) {
        // Add the new user to the users array
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
}
// Return error if username or password is missing
return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    console.log(Object.keys(books).length);
 res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
  console.log(typeof(isbn));
    res.send(books[isbn]); 
    
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    for(let i=1;i<Object.keys(books).length; i++){ 
            if(books[i].author===author){
                res.send(books[i]);
                break;
            }
        }
    
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    for(let i=1;i<Object.keys(books).length; i++){ 
            if(books[i].title===title){
                res.send(books[i]);
                break;
            }
        }
}); 

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
  res.send(books[isbn].reviews);

});

module.exports.general = public_users;
