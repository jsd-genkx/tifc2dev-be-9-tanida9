require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;


// Middleware to parse JSON bodies
app.use(express.json());

// Simulated data for API
const books = [
  { id: 1,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
  },
];


// Filter books by genre (optional)
app.get("/books", (req, res, next) => {
  setTimeout(() => {
    const { genre } = req.query;
    if (genre) {
      const filteredBooks = books.filter((book) => book.genre.includes(genre));
      res.json(filteredBooks);
    } else {
      res.json(books);
    }
  }, 1000); // Simulate a 1-second delay
});

// GET specific book by ID with async/await
app.get("/books/:id", async (req, res, next) => {
  try {
    const book = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundBook = books.find((b) => b.id === parseInt(req.params.id, 10)); // 10 คือเลขฐาน 10 ดักไว้เมื่อ id ไม่ใช่เลขฐาน 10
        if (foundBook) {
          resolve(foundBook);
        } else {
          reject(new Error("Book not found"));
        }
      }, 1000); // Simulate a 1-second delay
    });
    res.json(book);
  } catch(err) {
    err.status = 404;
    next (err);
  }
});

// Middleware to handle 404 errors
app.use(( req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// General error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const response = {
    message: err.message || "Internal Server Error",
    status: status,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
}

  console.error(err.stack);
  res.status(status).json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
