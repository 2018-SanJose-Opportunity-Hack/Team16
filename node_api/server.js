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

//post API to get all user transactions
app.post("/api/user_transactions", function (req, res) {
        var user_email = req.body.user_email;
        var query = "select * from TRANSACTION_LOG where user_email ='"+ user_email+"'";
    
    executeQuery(res, query);
});

// update preference
app.post("/api/update_preference", function (req, res) {
    var user_email = req.body.user_email;
    var payment_account = req.body.payment_account; 
    var query = "update PAYMENT_MODES SET preference_flag = 'Y' where "+
    "user_email = '"+user_email+"' and payment_type = '"+payment_account+"'" ;

executeQuery(res, query);
});

//POST total won
app.post("/api/get_winnings", function (req, res) {
    var user_email = req.body.user_email;
    var query = "select sum(transaction_amount) as total_sum from TRANSACTION_LOG where user_email = '"+
    user_email+"' and transaction_type='credit'";

executeQuery(res, query);
});
//POST total won
app.post("/api/get_withdraws", function (req, res) {
    var user_email = req.body.user_email;
    var query = "select sum(transaction_amount) as total_sum from TRANSACTION_LOG where user_email = '"+
    user_email+"' and transaction_type='debit'";

executeQuery(res, query);
});
//post API to update the read 
app.post("/api/update_user_saw", function (req, res) {
    var user_email = req.body.user_email;
    var user_token = req.body.url_token;
    var query = "update TRANSACTION_LOG set scratched='Y'"+
    " where transaction_type = 'credit' and url_token ='"+user_token+"' and user_email ='"+ user_email+"'";

executeQuery(res, query);
});

//post redeem
app.post("/api/redeem", function (req, res) {
    var user_email = req.body.user_email;
    //var user_token = req.body.url_token;
    var payment_mode = req.body.payment_mode;
    var amount = req.body.amount;
    var query = "insert into TRANSACTION_LOG (user_email,user_id,amount,transaction_type,transaction_amount,payment_mode)"+
     "values ('"+user_email+"','"+user_email+"',"+amount+",'debit',"+amount+",'"+payment_mode+"')";
executeQuery(res, query);
});

// POST RUN ANY QUERY
app.post("/api/run_qqqq", function (req, res) {
   var query = req.body.query;
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
const uuidv1 = require('uuid/v1');

app.post("/api/uploadFile", function (req, res) {
    console.log('API: Upload Fle ' + 'STEP: Start');
    var resultObject = {
        successMsg: '',
        errorMsg: 'Error Uploading Image',
        data: {}
    }


    //Check If alread done for current week
    pool.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
        // Use the connection
        connection.query("select * from TRANSACTION_LOG where draw_number=" + JSON.stringify(new Date().getWeek() + "-" + new Date().getWeekYear()), function (error, results, fields) {
            // When done with the connection, release it.
            connection.release();
            // Handle error after the release.
            if (error) {
                console.log("Error while querying database :- " + error);
                res.send(error);
            }
            else {
                console.log("SUCCESS");
                console.log(results);
                if (results.length = 0) {
                    resultObject.successMsg = '';
                    resultObject.errorMsg = 'Already done for this week.';
                    res.json(resultObject);
                } else {
                    let form = new multiparty.Form();
                    form.parse(req, (err, fields, files) => {
                        resultObject = {
                            successMsg: '',
                            errorMsg: 'Error Uploading File',
                            data: {}
                        }
                        if (err) console.log(err);

                        //If no error send file upload success
                        resultObject.successMsg = 'File Uploaded Successfully';
                        resultObject.errorMsg = '';
                        res.json(resultObject);

                        console.log(files);
                        let { path: tempPath } = files.file[0];
                        var winners = [];
                        var winnerCount = 0;
                        var length = 0;
                        // File path.
                        readXlsxFile(tempPath).then((rows) => {
                            // `rows` is an array of rows
                            // each row being an array of cells.
                            console.log(rows);
                            length = parseInt(rows.length) - 1;
                            if (parseInt(length) > 100) {
                                winnerCount = 70;
                            } else {
                                winnerCount = parseInt(length * 0.7);
                            }
                            console.log("Winner Count=" + winnerCount);
                            console.log("Length=" + length);
                            utils.randomArray(winnerCount, length, function (err, result) {
                                console.log("result");

                                console.log(result);
                                var draw_number = JSON.stringify(new Date().getWeek() + "-" + new Date().getWeekYear());
                                result.forEach(element => {
                                    var url_token = JSON.stringify(uuidv1());
                                    var data = rows[element];
                                    var query = "insert into TRANSACTION_LOG (draw_number, user_email, user_id, amount,scratched,transaction_type,url_token)" +
                                        " values (" + draw_number + "," + JSON.stringify(data[1]) + ", " + JSON.stringify(data[0]) + "," + data[3] + ",'N','credit'," + url_token + ");";

                                    pool.getConnection(function (err, connection) {
                                        if (err) throw err; // not connected!

                                        // Use the connection
                                        connection.query(query, function (error, results, fields) {
                                            // When done with the connection, release it.
                                            connection.release();
                                            // Handle error after the release.
                                            if (error) {
                                                console.log("Error while querying database :- " + error);
                                            }
                                            else {
                                                console.log("SUCCESS");
                                                //Sending EMail:
                                                
                                                var payload = {
                                                    to:data[1],
                                                    subject : "SaverLife : Scratch for Week "+draw_number,
                                                    name:data[0],
                                                    token:url_token,
                                                }
                                                utils.emailService(payload);

                                            }
                                        });
                                        // Don't use the connection here, it has been returned to the pool.
                                    });
                                });
                            });
                        })

                    })
                }
            }
        });
        // Don't use the connection here, it has been returned to the pool.
    });


});


Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function () {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
}