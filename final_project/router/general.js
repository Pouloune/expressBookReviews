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
    
   new Promise((resolve, reject) => {
        try {
            const bookCount = Object.keys(books).length;
            console.log(bookCount);

            // Resolving the books data to send
            resolve(JSON.stringify(books, null, 4));
        } catch (error) {
            // If there is an error, reject the promise
            reject("Error retrieving books");
        }
    })
    .then(data => {
        // Sending the resolved data as a response
        res.send(data);
    })
    .catch(error => {
        // Handling the rejection and sending an error response
        res.status(500).send(error);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
  console.log(typeof(isbn));
    res.send(books[isbn]); 

    new Promise((resolve,reject)=>{
        try{
            resolve(books[isbn])
        }
        catch (error) {
            // If there is an error, reject the promise
            reject("Error retrieving books");
        }
    })
    .then(data => {
        // Sending the resolved data as a response
        res.send(data);
    })
    .catch(error => {
        // Handling the rejection and sending an error response
        res.status(500).send(error);
    });
    
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const book = await getBookByAuthor(author);
        if (book) {
            res.send(book);
        } else {
            res.status(404).send({ message: "Author not found" });
        }
    } catch (error) {
        res.status(500).send({ message: "An error occurred", error });
    }
});
// Helper function to find a book by author
const getBookByAuthor = (author) => {
    return new Promise((resolve) => {
        for (let i = 1; i <= Object.keys(books).length; i++) {
            if (books[i].author === author) {
                resolve(books[i]);  // Resolve with the found book
                return;  // Exit the function after resolving
            }
        }
        resolve(null);  // Resolve with null if no book is found
    });
};

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const book = await getBookByTitle(title);
        if (book) {
            res.send(book);
        } else {
            res.status(404).send({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).send({ message: "An error occurred", error });
    }
});
// Helper function to find a book by title
const getBookByTitle = (title) => {
    return new Promise((resolve) => {
        for (let i = 1; i <= Object.keys(books).length; i++) {
            if (books[i].title === title) {
                resolve(books[i]);  // Resolve with the found book
                return;  // Exit the function after resolving
            }
        }
        resolve(null);  // Resolve with null if no book is found
    });
};

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
  res.send(books[isbn].reviews);

});

module.exports.general = public_users;
