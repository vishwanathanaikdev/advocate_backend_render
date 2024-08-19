const ObjectId = require('mongoose').Types.ObjectId
const Case = require('../models/case');
const OpinionFile = require('../models/opinion_file');
const Reminder = require('../models/reminder');
const Bills = require('../models/bills');
const Payment = require('../models/payment');
const moment = require('moment')


exports.get = async(req,res)=>{
    let roles = req.body.user.roles
    let params = {}

    if(roles.includes('hod')){
       params = {}
    }else{
       params = {created_by:ObjectId(req.body.user.id)}
    }

    const total_case = await Case.find(params).count()
    const total_case_pending = await Case.find({...params,status:'Pending'}).count()
    const total_case_progress = await Case.find({...params,status:'In Progress'}).count()
    const total_case_completed = await Case.find({...params,status:'Completed'}).count()
    const total_case_hold = await Case.find({...params,status:'Hold'}).count()

    const total_opinion_file = await OpinionFile.find(params).count()
    const total_opinion_file_pending = await OpinionFile.find({...params,status:'Pending'}).count()
    const total_opinion_file_progress = await OpinionFile.find({...params,status:'In Progress'}).count()
    const total_opinion_file_completed = await OpinionFile.find({...params,status:'Completed'}).count()
    const total_opinion_file_hold = await OpinionFile.find({...params,status:'Hold'}).count()

    const bills = await Bills.find(params).count()

   
    const billstotalAmt = await Bills.aggregate([
                  {$match:params},
                  {
                     $group:{
                        _id:null,
                        totalAmountWithGst:{$sum:"$amountWithGst"},
                        totalAmountWithoutGst:{$sum:"$amountWithoutGst"},
                     }
                  }
    ]).exec()

   
    const payment = await Payment.find(params).count()
    const paymenttotalAmt = await Payment.aggregate([
      {$match:params},
      {
         $group:{
            _id:null,
            totalAmountWithGst:{$sum:"$amountWithGst"},
            totalAmountWithoutGst:{$sum:"$amountWithoutGst"},
         }
      }
   ]).exec()

    const reminder = await Reminder.find(params).count()
    const reminder_active = await Reminder.find({...params,isActive:true}).count()
     
    const today = JSON.stringify(new Date()).slice(1,11)+"T00:00:00.000+00:00"
    const tommorrow = JSON.stringify((new Date(moment().add(1, 'd')))).slice(1,11)+"T23:59:59.000+00:00";


    let today_params =  {createdAt: {
      $gte: new Date(today).toISOString(),
      $lt: new Date(tommorrow).toISOString()
    }}

    let today_params1 =  {createdAt: {$gte: new Date(JSON.stringify(new Date()).slice(1,11)), $lt: new Date(moment(JSON.stringify(new Date()).slice(1,11)).add(1, 'd'))}}


    const today_case = await Case.find({...params,...today_params}).populate('client')
    const today_office_file = await OpinionFile.find({...params,...today_params}).populate('client')

    const today_bills = await Bills.aggregate([
      
      {$match:{...params,...today_params1}},
      {
         $group:{
            _id:null,
            totalAmountWithGst:{$sum:"$amountWithGst"},
            totalAmountWithoutGst:{$sum:"$amountWithoutGst"},
         }
      }
    ]).exec()

    const today_payment = await Payment.aggregate([
      {$match:{...params,...today_params1}},
      {
         $group:{
            _id:null,
            totalAmountWithGst:{$sum:"$amountWithGst"},
            totalAmountWithoutGst:{$sum:"$amountWithoutGst"},
         }
      }
    ]).exec()

    const today_reminder = await Reminder.aggregate([
      {$match:params},
      {$match:{date: {$gte: new Date(JSON.stringify(new Date()).slice(1,11)), $lt: new Date(moment(JSON.stringify(new Date()).slice(1,11)).add(1, 'd'))}}},
      {
         $lookup:{
            from:'caseschemas',
            localField:'case',
            foreignField:'_id',
            pipeline:[
               {
                  $lookup:{
                     from:'clientschemas',
                     localField:'client',
                     foreignField:'_id',
                     as:'client'
                  }
               },
               {
                  $unwind:{
                     path:"$client",
                     preserveNullAndEmptyArrays:true
                  }
               },
               {
                  $lookup:{
                     from:'casetypes',
                     localField:'case_type',
                     foreignField:'_id',
                     as:'case_type'
                  }
               },
               {
                  $unwind:{
                     path:"$case_type",
                     preserveNullAndEmptyArrays:true
                  }
               },
               {
                  $lookup:{
                     from:'casestages',
                     localField:'stage',
                     foreignField:'_id',
                     as:'stage'
                  }
               },
               {
                  $unwind:{
                     path:"$stage",
                     preserveNullAndEmptyArrays:true
                  }
               }
            ],
            as:'case'
         }
      },
      {
         $unwind:{
            path:"$case",
            preserveNullAndEmptyArrays:true
         }
      },
      {
         $lookup:{
            from:'opinionfileschemas',
            localField:'opinion_file',
            foreignField:'_id',
            pipeline:[
               {
                  $lookup:{
                     from:'users',
                     localField:'allocation_of_work',
                     foreignField:'_id',
                     as:'allocation_of_work'
                  }
               },
               {
                  $unwind:{
                     path:"$allocation_of_work",
                     preserveNullAndEmptyArrays:true
                  }
               },
               {
                  $lookup:{
                     from:'users',
                     localField:'created_by',
                     foreignField:'_id',
                     as:'created_by'
                  }
               },
               {
                  $unwind:{
                     path:"$created_by",
                     preserveNullAndEmptyArrays:true
                  }
               }
            ],
            as:'opinion_file'
         }
      },
      {
         $unwind:{
            path:"$opinion_file",
            preserveNullAndEmptyArrays:true
         }
      },
    ])


    let sendData = {
      total_case,
      total_case_pending,
      total_case_progress,
      total_case_completed,
      total_case_hold,

      total_opinion_file,
      total_opinion_file_pending,
      total_opinion_file_progress,
      total_opinion_file_completed,
      total_opinion_file_hold,

      bills,
      billamount:billstotalAmt.length > 0 ? billstotalAmt[0] : {totalAmountWithGst:0,totalAmountWithoutGst:0},
      payment,
      paymentamount:paymenttotalAmt.length > 0 ? paymenttotalAmt[0] : {totalAmountWithGst:0,totalAmountWithoutGst:0},
      reminder,
      reminder_active,
      today_case,
      today_office_file,
      today_case_total:today_case.length + today_office_file.length,
      today_bills:today_bills.length > 0 ? today_bills[0] : {totalAmountWithGst:0,totalAmountWithoutGst:0},
      today_payment:today_payment.length > 0 ? today_payment[0] : {totalAmountWithGst:0,totalAmountWithoutGst:0},
      today_reminder,
      today_reminder_total:today_reminder.length

    }

    return res.status(200).send({status:true,data:sendData})
}