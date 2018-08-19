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
            attachments: [{
                filename: 'Logo.jpg',
                path: __dirname +'\\Logo.jpg',
                cid: 'logo' //my mistake was putting "cid:logo@cid" here! 
            }],
            subject: data.subject,
            html: 
            '<img src="cid:logo"><br>'+
            '<p>Hello <b>'+data.name+'</b></p><br>' +
            'Congratulations on saving at least $'+data.amount_saved +' this week! Will you win an extra $'+data.amount_saved +'?<br><br>'+
            '<button style="margin-left:80px;background-color:#ac2189}" ><a href='+url+' target="_blank" >Play Scratch and Save</a></button><br><br>' +
            'For the next seven weeks, you can play Scratch and Save every week that you save at least $5 in the account you\'ve linked to SaverLife. And remember, the more you save, the more you can win!'+
            '<br><br>Happy saving!'+
            '<br>Team SaverLife'
            
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