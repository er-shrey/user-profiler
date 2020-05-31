const cron = require("node-cron");
const btoa = require('btoa');
const config = require('../config/config');
const Users = require('../config/database/models/users');
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    /**
     * Nodemailer transporter
     */
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.secure,
    auth: {
      user: config.smtp.username,
      pass: config.smtp.password
    }
});

const newUserMail = cron.schedule("*/30 * * * *", () => {
    /**
     * Send mail to new user every 30 minutes
     */
    sendmails();
}, {
    scheduled: false
});

function sendmails() {
    /**
     * Getting new users list and generating new token for each.
     */
    getNewUsers().then(users => {
        var token = "";
        for (user of users) {
            const now = Math.floor(new Date() / 1000);
            token = btoa(now + '##' + user.user_id);
            user.update({
                token:token
            })
            .then(updatedUser => {
                sendTokenToUser(user.email, token);
            })
            .catch(err => {
                console.log(err);
            });
        }
    })
    .catch(err => {
        console.log(err);
    });
    console.log("Sending mails");
}

function getNewUsers() {
    /**
     * Fetching list of new users
     */
    return Users.findAll({
        where: {
            is_new: true
        }
    });
}

function sendTokenToUser(email, token) {
    /**
     * Sending mail to the new user
     */
    var link = config.emailHeader + config.mailSettings.newUserMail.url+ token;
    var mailOptions = {
        from: '"' + config.smtp.sender + '" <' + config.smtp.username + '>',
        to: email,
        subject: "Profile Created, Please update your profile",
        html: 'Hi,<br><br>We have created a profile of yours. Please update it.<br>Please click on the link below to update your profile<br><a href="'+link+'" style="margin: 10px 0; display: inline-block; padding: 7px; text-decoration: none; background-color: #6c63ff; color: #fff; border-radius: 4px;">Update Profile</a><br><br>Thankyou'
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log("can't send mail to " + email + " " + error);
        } else {
          console.log("Email successfully sent to " + email);
        }
    });
}

module.exports = newUserMail;