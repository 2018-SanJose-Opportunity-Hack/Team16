module.exports = {
    emailService: function (to, subject, body) {

        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'fandango.prototype@gmail.com',
                pass: 'Project#3'
            }
        });

        var mailOptions = {
            from: 'saverlife@gmail.com',
            to: to,
            subject: subject,
            text: body
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    },

    randomArray : function(length, max) {
        var arr = []
        while(arr.length < length){
            var randomnumber = Math.floor(Math.random()*max) + 1;
            if(arr.indexOf(randomnumber) > -1) continue;
            arr[arr.length] = randomnumber;
        }
        return arr;
    }

};