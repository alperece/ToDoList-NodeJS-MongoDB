// 1 Create variables and define the modules:
// 2 Connect the database: 
// 3 Define the express, use bodyParser and set the hbs as a view engine: 
// 4 GET request - get data from server to page :
// 5 POST Request - sent data from page to server : 
// 6 GET request - DELETE :
// 7 Listen the port : 

// *****************************************************

// npm init
// Every Node app is a package, and should have a package.json
// all modules are packages, but not all packages are module. 
// Modules will be installed in the package.json file, and placed into the node_modules folder

// REQUIREMENTS : *********************************************************
// Mongo DB
// Node.js
// Express - Install with command npm install express.
// Express Sessions - Install with command npm install express - session.
// Mongoose for Node.js - Install with command $ npm install mongoose
// npm install hbs

// 1 Create variables and define the modules: *********************************************************
// We need to include the packages in our Node.js application, create the following variables and require the modules:

// Using Node.js `require()` to import
const mongoose = require('mongoose');

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');


// 3 Define the express, use bodyParser and set the hbs as a view engine: *********************************************************
// We use EXPRESS to initialize the useful packages like sessions handling HTTP requests
var app = express();

//the bodyParser package will extract the form data from the login.hbs file.
//we have to use "body-parser" node module to read HTTP POST data

// bodyParser.urlencoded({ extended: true }) :
//if extended: true, then you can parse nested objects
// Nested Object = { person: { name: cw } }

// app.use(bodyParser.json()) :Basically tells the system that you want json to be used.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Using hbs as the default view engine requires just one line of code in your app setup.

// *** To use a different extension(i.e.html) for your template files:
// *** app.set('view engine', 'html');
// hbs has a feature called partials. It is used to create a layout. If you don't use it, No need to use 
// HBS is : Express.js view engine for handlebars.js

app.set('view engine', 'hbs');

// 2 Connect the database:  *********************************************************
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

//var url = "mongodb://localhost:27017/";

// check the connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected');
});

var taskSchema = new mongoose.Schema({
  
    task: String,
    date: Date
  });
var Task = mongoose.model('tasks', taskSchema);

// 4 GET request - get data from server to page : *********************************************************
//When we open the page and refresh the page, the server will send the datas to the login.hbs file.
//GET is the HTTP method. GET means that we want to receive information from the target web application. 
app.get('/', function (request, response) {
  
  Task.find(function (err, tasks) {
    if (err) return console.error(err);
    response.render('login', { list: tasks });
  });
});


// 5 POST Request - sent data from page to server : *********************************************************
//when the client enters new task in the To Do List form and clicks the submit button, the form data will be sent to the server by POST request.

//we first create the POST request in our script
//To Do List form action is to: "insert" so we need to use that here,
//After, we create 3 variables (id,task,date)

//POST method is to post the information to the target web application 

app.post('/insert', function (request, response) {

  new Task({ task:request.body.task,date:request.body.date}).save(
    function (err, Task) {
      if (err) response.redirect('/');
      response.send('Please enter new TASK!');
      response.end();
    }
  );
});

// 6 GET request - DELETE : *********************************************************
app.get('/delete', function (request, response) {
  var id = request.query.id
  console.log(id);
  
  // Now, we delete the task's id from the database by MongoDB query

  if (id) {
    Task.deleteOne({ _id: id },function (err, tasks)  {
          if (err) throw err;
          response.redirect('/');
      });
      // if the value in the body is empty, the sender will see this message at the background
  } else {
      response.send('Please enter Id');
      response.end();
  } 
});

// 7 Listen the port : *********************************************************
//Our web application needs to listen on a port, for testing purposes we'll use port 3000:
app.listen(3000);