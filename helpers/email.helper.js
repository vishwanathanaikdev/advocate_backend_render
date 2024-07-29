const nodemailer = require("nodemailer")
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
const logs = require('./logger.helper').Logger

exports.sendMail = (mailOptions, from=null)=>{
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        /* host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true, // true for 465, false for other ports */
        auth: {
            user: process.env.MAIL_USERNAME, // generated ethereal user
            pass: process.env.MAIL_PASSWORD, // generated ethereal password
        },
    })

    //pointing to email template folder

    transporter.use('compile', hbs({
        viewEngine: {
            partialsDir: path.resolve('./views/emails/'),
            defaultLayout: false
        },
        viewPath: path.resolve('./views/emails/')
    }))

    // send mail with defined transport object
    
    transporter.sendMail({from: from!==null?from:'"FidelitusCorp" <'+process.env.MAIL_FROM_ADDRESS+'>', ...mailOptions}, (err, info)=>{
        if(err) {
            logs.error(`Email:- ${err}`)
            return false
        }
        else {
            let logData = `Email sent [From: ${info.envelope.from}, To: ${info.envelope.to}, MessageId: ${info.messageId}, Response: ${info.response}}]`
            logs.info(`Email:- ${logData}`)
            return info
        }
    })
}
