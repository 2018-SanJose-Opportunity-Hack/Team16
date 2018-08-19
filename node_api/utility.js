module.exports = {
    emailService: function (data) {

        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'fandango.prototype@gmail.com',
                pass: 'Project#3'
            }
        });
        var url = "http://localhost:3000/scratch/"+data.token;
        var mailOptions = {
            from: 'saverlife@gmail.com',
            to: data.to,
            subject: data.subject,
            html: '<p>Hello <b>'+data.name+'</b></p></br> <a href='+url+' target="_blank" >Click to Scratch</a>'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    },

    randomArray : function(length, max, callback) {
        console.log("Random Array Function");
        var arr = []
        while(parseInt(arr.length) < parseInt(length)){
            var randomnumber = Math.floor(Math.random()*max) + 1;
            if(arr.indexOf(randomnumber) > -1) continue;
            arr[arr.length] = randomnumber;
        }
        callback(null,arr);
    }

};