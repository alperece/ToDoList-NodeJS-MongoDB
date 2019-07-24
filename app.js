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
// MySQL Server
// Node.js
// Express - Install with command npm install express.
// Express Sessions - Install with command npm install express - session.
// MySQL for Node.js - Install with command npm install mysql
// npm install hbs

// CREATE DATABASE : *********************************************************

// CREATE DATABASE IF NOT EXISTS`newlist` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
// USE`newlist`;

// CREATE TABLE IF NOT EXISTS`tasks`(
//     `id` int(20) NOT NULL,
//     `task` varchar(255) NOT NULL,
//     `date` varchar(255) NOT NULL
// ) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8;

// INSERT INTO`tasks`(`id`, `task`, `date`) VALUES(101, 'Ready to go', '01.01.2020');

// ALTER TABLE`tasks` ADD PRIMARY KEY(`id`);
// ALTER TABLE`tasks` MODIFY`id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

//******

// CREATE DATABASE BY NODE JS:

// var mysql = require('mysql');

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "newuser",
//     password: ""
// });

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
//     con.query("CREATE DATABASE lists", function (err, result) {
//         if (err) throw err;
//         console.log("Database created");
//     });
// });

// CREATE TABLE : ************

// CREATE TABLE BY NODE JS:

// var mysql = require('mysql');

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "newuser",
//     password: "",
//     database: "mydb"
// });

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "CREATE TABLE tasks (name VARCHAR(255), address VARCHAR(255))";
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Table created");
//     });
// });



// 1 Create variables and define the modules: *********************************************************
// We need to include the packages in our Node.js application, create the following variables and require the modules:

var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');


// 2 Connect the database:  *********************************************************
// At first, create a database and table in MySql Editor
// Do not forget to change the connection details with your own 
//We can now connect to our database with the following code:

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'newlist'
});

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

// 4 GET request - get data from server to page : *********************************************************
//When we open the page and refresh the page, the server will send the datas to the login.hbs file.
//GET is the HTTP method. GET means that we want to receive information from the target web application. 

app.get('/', function (request, response) {
    connection.query('SELECT * FROM tasks', null, function (error, results, fields) {
        response.render('login', { list: results })
    });
});

// 5 POST Request - sent data from page to server : *********************************************************
//when the client enters new task in the To Do List form and clicks the submit button, the form data will be sent to the server by POST request.

//we first create the POST request in our script
//To Do List form action is to: "insert" so we need to use that here,
//After, we create 3 variables (id,task,date)

//POST method is to post the information to the target web application 
app.post('/insert', function (request, response) {
    let newtask = {
        id: request.body.id,
        task: request.body.task,
        date: request.body.date
    };

    // Now, we insert the new task (id,task,date) to the database
    if (newtask) {
        connection.query('Insert into tasks (id,task,date) values (?,?, ?)', [newtask.id, newtask.task, newtask.date], function (error, results, fields) {
            //If no results are returned we send to the client an error message,
            if (error) throw error;
            response.redirect('/');
        });
        // if the value in the body is empty, the sender will see this message at the background
    } else {
        response.send('Please enter new TASK!');
        response.end();
    }
});
// If everything went as expected and the client logs in they will be redirected to the home page.

// 6 GET request - DELETE : *********************************************************
//we first create the GET request in our script
//To Do List form action is to: "delete" so we need to use that here,
//After, we create one variables (id)

app.get('/delete', function (request, response) {
    var id = request.query.id

    // Now, we delete the task's id from the database by MySql query
    if (id) {
        connection.query('delete from tasks where id = ?', [id], function (error, results, fields) {
            if (error) throw error;
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
