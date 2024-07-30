const cron = require('node-schedule')
const mail = require('./helpers/email.helper')
const Reminder = require('./models/reminder')
const CaseSchema = require('./models/case')
const OpinionFileSchema = require('./models/opinion_file')
const Role = require('./models/role')
const UserRole = require('./models/user_role')

const moment = require('moment')

cron.scheduleJob("0 7 * * *", async function() {
    let date = new Date();
    let caseData = await CaseSchema.find({next_hearing_date:date}).count()
    let opinionData = await OpinionFileSchema.find({next_hearing_date:date}).count()

    const role = await Role.find({role_name:'admin'}) 
    let users = await UserRole.aggregate([
     {$match:{role_id:role._id}},
     {$lookup:{
          from:'users',
          localField:'user_id',
          foreignField:'_id',
          as:'user_id'
     }},
     {
        $unwind:{
          path:'$user_id',
          preserveNullAndEmptyArrays:true
        }
     }
    ])

    let summary = `Hi Admin we found that you have totally ${caseData} Cases and ${opinionData} Opinion File. Make sure that you complete all the task assigned you!` 

    let mailOptions = {
        to:users.map((user)=>user.user_id.email).toString(),
        subject: "Advocate CRM Today Case Opinion List",
        template: 'earlyschedule',
            context:{
                url:process.env.APP_URL,
                summary:summary,
            }
    }
    mail.sendMail(mailOptions)

})

cron.scheduleJob("* * * * *", async function() {
    await Reminder.find({isActive:true}).populate(['created_by','case','opinion_file']).exec((err,datas)=>{
        datas?.forEach(async(data)=>{
            if(moment(data.on_date_time).utcOffset("+05:30").format() === moment(new Date()).add(5,'hours').add(30,'minutes').utcOffset("+05:30").format()) {
               await Reminder.findByIdAndUpdate(data._id,{isActive:false})
                let url = process.env.APP_URL + data.type == 'case' ? 'case/civil_court' : 'opinion_files/list'
                let mailOptions = {
                    to:data.created_by.email,
                    subject: "Advocate CRM Reminder",
                    template: 'reminder',
                        context:{
                            name:data.created_by.name,
                            url:url,
                            title:data.title,
                            description:data.description,
                        }
                    }

                    mail.sendMail(mailOptions)
            }
        })

    })
    // console.log("Cron Job is running!")
})