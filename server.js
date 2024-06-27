const express = require('express');
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 3000;

let BASE_PATH = __dirname;
let DB_PATH = BASE_PATH + "/TaskManager.db"

// Ensuring information can be transmitted through CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Tests to make sure server is running
app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/test', (req, res) =>{
  res.send(JSON.stringify({"test": "this is working"}));
  console.log("Hello")
});

//-------------------BEGIN HELPER FUNCTIONS----------------------------------\\

function connectToDatabase(){
  return new sqlite3.Database('./TaskManager.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
};

//-------------------END HELPER FUNCTIONS----------------------------------\\
//-------------------BEGIN DATABASE ENDPOINTS----------------------------------\\

//------BEGIN POST--------\\
app.post('/addTask', (req, res) => {
  let db = connectToDatabase();

  // Get data from request
  info = req.query;

  sql = `INSERT INTO Tasks (Title, Description, DateCreated, DateDue, DateCompleted, Priority, Username) VALUES ("${info.title}", "${info.description}", "${info.dateCreated}", "${info.dateDue}", "${info.dateCompleted}", ${info.priority}, "${info.username}")`;

  // Execute SQL command
  db.exec(sql, (err) => {
    if (err) {
      throw err;
    }
  })
  db.close();
});

app.post('/addUser', (req, res) => {
  // TODO: Untested
  let db = connectToDatabase();

  // Get data from request
  info = req.query;

  sql = `INSERT INTO Users (Username, Password) VALUES ("${info.username}", "${info.password}")`;

  // Execute SQL command
  db.exec(sql, (err) => {
    if (err) {
      throw err;
    }
  })
  db.close();
});

app.post('/markComplete', (req, res) => {
  let db = connectToDatabase();

  info = req.query;

  sql = `UPDATE Tasks SET DateCompleted = "${(new Date()).toString()}" WHERE ID = ${info.ID}`;
  console.log(sql);

  db.exec(sql, (err) => {
    if (err) {
      throw err;
    }
  })
  db.close();
})

app.post('/markIncomplete', (req, res) => {
  let db = connectToDatabase();

  info = req.query;

  sql = `UPDATE Tasks SET DateCompleted = "null" WHERE ID = ${info.ID}`;
  console.log(sql);

  db.exec(sql, (err) => {
    if (err) {
      throw err;
    }
  })
  db.close();
})

//------END POST--------\\
//------BEGIN GET--------\\
app.get('/getTasks', (req, res) => {
  // TODO: Get username from req, and use to filter the SQL query
  console.log("get tasks called")
  let db = connectToDatabase();

  let sql = "SELECT * FROM Tasks ORDER BY Priority DESC, DateDue ASC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });

  db.close();
});

app.get('/verifyUser', (req, res) => {
  // TODO: Write this function
  let db = connectToDatabase();

  res.send(true);

  db.close();
});
//------END GET--------\\
//-------------------END DATABASE ENDPOINTS----------------------------------\\

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});