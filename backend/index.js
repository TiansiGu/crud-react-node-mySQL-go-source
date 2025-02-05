// import express from "express";
// import mysql from "mysql2";
// import cors from "cors";

// const app = express();

// const db = mysql.createConnection({
//   host: "db",
//   port: 3306,
//   user: "root",
//   password: "",
//   database: "test",
// });

// app.use(express.json()); //return json data using the api server postman

// app.use(cors());

// app.get("/", (req, res) => {
//   console.log(db);
//   res.json("Hello World from the backend!!!");
// });

// //postman -> get method  http://localhost:8800/books
// app.get("/books", (req, res) => {
//   const query = "SELECT * FROM books";
//   db.query(query, (err, data) => {
//     if (err) {
//       console.log(err.message);
//       return res.json(err);
//     }
//     return res.json(data);
//   });
// });

// //postman ---> post method
// //json body bellow
// //----------------------------- http://localhost:8800/books
// //{
// // "title": "title from client",
// // "description": "description from client",
// // "cover": "cover from client"
// // }

// app.post("/books", (req, res) => {
//   const query =
//     "INSERT INTO books (`title`, `description`, `price`, `cover`) VALUES (?)";
//   const values = [
//     req.body.title,
//     req.body.description,
//     req.body.price,
//     req.body.cover,
//   ];

//   db.query(query, [values], (err, data) => {
//     if (err) return res.json(err);
//     return res.json("Book has been created successfully!!!");
//   });
// });

// app.delete("/books/:id", (req, res) => {
//   const bookID = req.params.id;
//   const query = "DELETE FROM books WHERE id = ?";

//   db.query(query, [bookID], (err, data) => {
//     if (err) return res.json(err);
//     return res.json("Book has been deleted successfully!!!");
//   });
// });

// app.put("/books/:id", (req, res) => {
//   const bookID = req.params.id;
//   const query =
//     "UPDATE books SET `title`= ?, `description`= ?, `price`= ?, `cover`= ? WHERE id = ?";

//   const values = [
//     req.body.title,
//     req.body.description,
//     req.body.price,
//     req.body.cover,
//   ];

//   db.query(query, [...values, bookID], (err, data) => {
//     if (err) return res.json(err);
//     return res.json("Book has been updated successfully!!!");
//   });
// });

// app.listen(8800, () => {
//   console.log("Connect to the backend!!!!");
// });

// //npm start

import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

const MAX_RETRIES = 10; // Maximum retry attempts
const RETRY_DELAY = 2000; // Delay between retries (in milliseconds)

let connectionRetries = 0;
let db;

// Function to establish database connection with retries
const connectWithRetry = () => {
  db = mysql.createConnection({
    host: "db",
    port: 3306,
    user: "root",
    password: "",
    database: "test",
  });

  db.connect((err) => {
    if (err) {
      console.error(`Database connection failed: ${err.message}`);
      connectionRetries++;

      if (connectionRetries < MAX_RETRIES) {
        console.log(
          `Retrying in ${
            RETRY_DELAY / 1000
          } seconds... (${connectionRetries}/${MAX_RETRIES})`
        );
        setTimeout(connectWithRetry, RETRY_DELAY);
      } else {
        console.error("Max retries reached. Could not connect to MySQL.");
        process.exit(1); // Exit process if unable to connect
      }
    } else {
      console.log("✅ Successfully connected to MySQL!");
      connectionRetries = 0; // Reset retries on success
    }
  });

  db.on("error", (err) => {
    console.error("Database error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("🔄 Attempting to reconnect...");
      connectWithRetry();
    }
  });
};

// Initialize database connection
connectWithRetry();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Hello World from the backend!!!");
});

// GET all books
app.get("/books", (req, res) => {
  const query = "SELECT * FROM books";
  db.query(query, (err, data) => {
    if (err) {
      console.log(err.message);
      return res.json(err);
    }
    return res.json(data);
  });
});

// POST a new book
app.post("/books", (req, res) => {
  const query =
    "INSERT INTO books (`title`, `description`, `price`, `cover`) VALUES (?)";
  const values = [
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.cover,
  ];

  db.query(query, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been created successfully!!!");
  });
});

// DELETE a book
app.delete("/books/:id", (req, res) => {
  const bookID = req.params.id;
  const query = "DELETE FROM books WHERE id = ?";

  db.query(query, [bookID], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been deleted successfully!!!");
  });
});

// UPDATE a book
app.put("/books/:id", (req, res) => {
  const bookID = req.params.id;
  const query =
    "UPDATE books SET `title`= ?, `description`= ?, `price`= ?, `cover`= ? WHERE id = ?";

  const values = [
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.cover,
  ];

  db.query(query, [...values, bookID], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been updated successfully!!!");
  });
});

app.listen(8800, () => {
  console.log("🚀 Backend server running on port 8800!");
});
