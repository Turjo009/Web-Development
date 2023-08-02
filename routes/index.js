const express = require('express');
const router = express.Router();

let previousMessage = null;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/pass-it-on', function(req, res) {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    res.status(400).send('Message is required');
  } else {
    if (previousMessage) {
      res.send(previousMessage);
    } else {
      res.send('first');
    }

    previousMessage = message;
  }
});

router.get('/brew', function(req, res) {
  const drink = req.query.drink;

  if (drink === 'tea') {
    res.send('A delicious cup of tea!');
  } else if (drink === 'coffee') {
    res.status(418).send("I'm a teapot.");
  } else {
    res.status(400).send('Invalid drink.');
  }
});


// This is the implimentation of Login without Database
// -------------------data------------------------
// let users = {
//   Ami: {password: 'mypass1'},
//   Gandu: {password: 'mypass2'}
// };

// --------------------- login -------------------------------
// router.post('/login', function(req, res, next){
//   if(req.body.username in users){
//     if(req.body.password === users[req.body.username].password){
//       req.session.username = req.body.username;
//       console.log("you are loggin in, Congrats");
//       res.end();
//     }
//     else{
//       res.sendStatus(401);
//       console.log("Wrong password, sad");
//     }
//   }
//   else{
//     res.sendStatus(401);
//     console.log("User Not Found, sad");
//   }
// });

// --------------------- signup ----------------------------------
// router.post('/signup', function(req, res, next){
//   let getUsername = req.body.username;
//   let getPassword = req.body.password;
//   console.log('Username entered: ' + getUsername + ' and the password is: ' + getPassword);
//   if (!(getUsername in users)) {
//     users[getUsername] = { password: getPassword };
//     console.log('New user ' + getUsername + ' has been created.');
//     res.sendStatus(200); // Send a success response back to the client
//   } else {
//     console.log('User already exists');
//     res.status(409).send('User already exists'); // Send a conflict response back to the client
//   }
// });
// --------------------- see users ----------------------------------
// router.get('/userList', function(req,res, next){
//   res.send(users);
// });




router.post('/login', function(req, res, next){
// req.pool.getConnection is used to obtain a connection from the connection pool.
// The connection pool allows efficient management of database connections.
  req.pool.getConnection( function(err, connection){
    if (err){
      res.sendStatus(500);
      return;
    }

// The query variable holds the SQL query that selects the username and user_password
// from the Users table based on the provided username and user_password values.
// The connection.query() function executes the SQL query using the
// connection and the values from req.body.username and req.body.password.
    let query = "SELECT username, user_password FROM Users WHERE username = ? AND user_password = ?;";
    connection.query(query, [req.body.username, req.body.password], function(err2, rows, fields){
      connection.release();
      if(err2){
        res.sendStatus(500);
        return;
      }
      console.log(JSON.stringify(rows));

// If there is at least one row returned (rows.length > 0), the username from the first
// row (rows[0].username) is assigned to req.session.username.
// This assumes that you have set up and configured session management appropriately.
      if (rows.length > 0) {
        req.session.username = rows[0].username; // Access the username property of the first row
        console.log("You are logged in. Congrats!");
        res.json(req.session.username);
      } else {
        console.log("User not found");
        res.sendStatus(401);
      }
    });
  });
});


router.post('/signup', function(req, res, next){

  req.pool.getConnection(function(err, connection){
    if(err){
      res.sendStatus(500);
    }

    var query = "INSERT INTO Users (user_id, username, user_password) SELECT COALESCE(MAX(user_id), 0) + 1, ?, ? FROM Users;";
    connection.query(query, [req.body.username, req.body.password], function(err2, rows, fields){
      connection.release();
      if(err2){
        res.sendStatus(500);
        return;
      }
      console.log(JSON.stringify(rows));
      console.log("User signed up successfully.");
      res.end();
    });
  });

});


router.get("/search", function(req, res){
  let item = req.query.myQuery;
  req.pool.getConnection(function(err, connection){
    if(err){
      res.sendStatus(500);
    }

    var query = "SELECT * FROM Users Where username = ?;";
    connection.query(query, [item], function(err2, rows, fields){
      connection.release();
      if(err2){
        res.sendStatus(500);
        return;
      }
      console.log("user found");
      res.json(rows);
    });
  });
});


router.get('/userList', function(req,res, next){
  req.pool.getConnection(function(err, connection){
    if(err){
      res.sendStatus(500);
    }

    var query = "SELECT * FROM Users";
    connection.query(query, function(err2, rows, fields){
      connection.release();
      if(err2){
        res.sendStatus(500);
        return;
      }
      console.log("userlist displayed");
      res.json(rows);
    });
  });
});

module.exports = router;













