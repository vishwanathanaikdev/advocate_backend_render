const cron = require('node-schedule')
const sendMail = require('./helpers/email.helper')
const Reminder = require('./models/reminder')

// cron.scheduleJob("*/1 * * * * *", function() {
//     // console.log("Cron Job is running!")
// })