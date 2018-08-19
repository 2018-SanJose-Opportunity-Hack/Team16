//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();
var utils = require("./utility");
var readXlsxFile = require('read-excel-file/node');


// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

//Initiallising connection string
var dbConfig = {

};

var mysql = require('mysql');
var pool = mysql.createPool({
    user: "root",
    password: "bsrihari09",
    host: "maddydb01.c7heilvdo1fe.us-east-1.rds.amazonaws.com",
    database: "paypal",
    port: '3306'
});


//Function to connect to database and execute query
var executeQuery = function (res, query) {

    pool.getConnection(function (err, connection) {
        if (err) throw err; // not connected!

        // Use the connection
        connection.query(query, function (error, results, fields) {
            // When done with the connection, release it.
            connection.release();

            // Handle error after the release.
            if (error) {
                console.log("Error while querying database :- " + error);
                res.send(error);
            }
            else {
                console.log("SUCCESS");
                res.send(results);
            }
        });
        // Don't use the connection here, it has been returned to the pool.
    });


}

//GET API
app.get("/api/transaction", function (req, res) {
    var query = "select * from TRANSACTION_LOG";
    executeQuery(res, query);
});


//GET API
app.get("/api/testEmail", function (req, res) {
    utils.emailService("vajid9@gmail.com", "Hey", "Hey");
    res.send("Mail Sent");
});

//POST API
app.post("/api/user", function (req, res) {
    var query = "INSERT INTO [user] (Name,Email,Password) VALUES (req.body.Name,req.body.Email,req.body.Password))";
    executeQuery(res, query);
});

//PUT API
app.put("/api/user/:id", function (req, res) {
    var query = "UPDATE [user] SET Name= " + req.body.Name + " , Email=  " + req.body.Email + "  WHERE Id= " + req.params.id;
    executeQuery(res, query);
});

// DELETE API
app.delete("/api/user /:id", function (req, res) {
    var query = "DELETE FROM [user] WHERE Id=" + req.params.id;
    executeQuery(res, query);
});

var multiparty = require('multiparty');
let fs = require('fs');

app.post("/api/uploadFile", function (req, res) {
    console.log('API: Upload Fle ' + 'STEP: Start');

    var resultObject = {
        successMsg: '',
        errorMsg: 'Error Uploading Image',
        data: {}
    }

    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        resultObject = {
            successMsg: '',
            errorMsg: 'Error Uploading Image',
            data: {}
        }
        if(err) console.log(files);
        
        console.log(files);
        let { path: tempPath } = files.file[0];

        // File path.
        readXlsxFile(tempPath).then((rows) => {
            // `rows` is an array of rows
            // each row being an array of cells.
            console.log(rows);

        })


        // fs.readFile(tempPath, (err, data) => {
        // });
        resultObject.successMsg = 'File Uploaded Successfully';
        resultObject.errorMsg = '';
        res.json(resultObject);
        return;
    })
});