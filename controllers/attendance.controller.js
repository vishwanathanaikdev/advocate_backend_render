const Attendance = require('../models/attendance')
const errFormatter = require('../helpers/error.formatter')
const moment = require('moment')
const ObjectId = require('mongoose').Types.ObjectId
const excelJS = require("exceljs");

exports.get = (req, res)=>{
    Attendance.find({...req.params.id?{_id: req.params.id}:''}, (err, datas)=>{
        err ? res.status(500).json({'status': false, 'errors': err}):
        res.status(200).json({'status': true, 'datas': (datas)?datas: 'No datas found'})
    })
}

exports.get_today = (req, res)=>{
    const today = JSON.stringify(new Date(moment())).slice(1,11)+"T00:00:00.000+00:00";
    const tommorrow = JSON.stringify((new Date(moment().add(1, 'd')))).slice(1,11)+"T23:59:59.000+00:00";
    Attendance.find({ createdAt: { $gte: new Date(today).toISOString(), $lt: new Date(tommorrow).toISOString() }}, (err, datas)=>{
        err ? res.status(500).json({'status': false, 'errors': err}):
        res.status(200).json({'status': true, 'datas': datas})
    })
}

exports.create = (req, res)=>{
    req.body.user_id = req.body.user.id
    Attendance.create(req.body, (err, data)=>{
        err ? res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)}):
        res.status(201).json({'status':true, 'datas': data})
    })
}


exports.filter = async (req, res)=>{
    const {user,page,from_date,to_date} = req.query 
    // console.log("user",user)

   
    // console.log("from",from,"to",to)

    let params = {}, skip = 0,  totalPages = 1 , total = 0, limit = 25
    
    if(user !== '' && user !== null && user !== 'null' && user !== undefined){
        params = {user_id: ObjectId(user)}
    }
    
    if (from_date && to_date) {
        let from = new Date(from_date).toISOString()?.slice(0,10) + "T00:00:00.000+00:00"
        let to = new Date(moment(to_date).add(1, 'd')).toISOString()?.slice(0,10) + "T23:59:59.000+00:00"
    
        params = { ...params, ...{ createdAt: { $gte: new Date(from), $lt: new Date(moment(to).add(1, 'd')) } } }
    }

    total = await Attendance.find(params).count()
    totalPages = Math.ceil(total/limit)


    console.log("params",params)
    console.log("total",total)
    console.log("totalPages",totalPages)

   

    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }

    return await Attendance.aggregate([
        {
            $match:params
        },
        {
            $lookup:{
                from:"users",
                localField:"user_id",
                foreignField:"_id",
                as:"user_id",
            }
        },
        {
           $unwind:{
            path:"$user_id",
            preserveNullAndEmptyArrays:true
           }
        },
        {$skip:skip},
        {$limit:limit}
    ])
    .exec(async(err,data)=>{
        console.log("err",err,"data",data)
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,datas:data,pagination:{total,totalPages,limit}})
    })
}

exports.downLoadExcel = async (req, res)=>{

    const workbook = new excelJS.Workbook();  // Create a new workbook
    const worksheet = workbook.addWorksheet("Users Attendance",{
        pageSetup:{fitToPage: true, fitToHeight: 5, fitToWidth: 7,horizontalCentered:true,verticalCentered:true}
    }); // New Worksheet
    const path = "public/attendance_report"; 

    const {user,page,from_date,to_date} = req.query 
    console.log("user",req.query )

    let params = {}, skip = 0,  totalPages = 1 , total = 0, limit = 25
    
    if(user !== '' && user !== null && user !== 'null' && user !== undefined){
        params = {user_id: ObjectId(user)}
    }
    
    if (from_date && to_date) {
        let from = new Date(from_date).toISOString()?.slice(0,10) + "T00:00:00.000+00:00"
        let to = new Date(moment(to_date).add(1, 'd')).toISOString()?.slice(0,10) + "T23:59:59.000+00:00"
        params = { ...params, ...{ createdAt: { $gte: new Date(from), $lt: new Date(moment(to).add(1, 'd')) } } }
    }


    total = await Attendance.find(params).count()
    totalPages = Math.ceil(total/limit)


   

    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }



    return await Attendance.aggregate([
        {
            $match:params
        },
        {
            $lookup:{
                from:"users",
                localField:"user_id",
                foreignField:"_id",
                as:"user_id",
            }
        },
        {
           $unwind:{
            path:"$user_id",
            preserveNullAndEmptyArrays:true
           }
        },
        // {$skip:skip},
        // {$limit:limit}
    ])
    .exec(async(err,data)=>{
        err && res.status(403).send({status:false,err:err})

        worksheet.columns = [
            { header: "Sl no.", key: "sl_no", width: 10 }, 
            { header: "User Name", key: "user_name", width: 20 },
            { header: "Date", key: "date", width: 20 },
            { header: "Log In Time", key: "log_in", width: 20 },
            { header: "Log Out Time", key: "log_out", width: 20 },
            { header: "Log In Address", key: "log_in_location", width: 80 },
            { header: "Log Out Address", key: "log_out_location", width: 80 },  
        ];

        let counter = 1
        data.forEach((user) => {
            user.sl_no = counter;
            worksheet.addRow({
                sl_no:counter,
                user_name:user.user_id.name !== undefined ? user.user_id.name : 'Not Added',
                date:JSON.stringify(user.createdAt).slice(1,11),
                log_in:user.log_in,
                log_out:user.log_out,
                log_in_location:user.log_in_location,
                log_out_location:user.log_out_location,
            }); // Add data in worksheet
            counter++;
        });

        try {
            const data = await workbook.xlsx.writeFile(`${path}/users.xlsx`)
             .then(() => {
               res.send({
                 status: "success",
                 message: "file successfully downloaded",
                 path: `${path}/user_attendance.xlsx`,
                });
             });
          } catch (err) {
              console.log("err",err)
              res.send({
              status: "error",
              message: "Something went wrong",
            });
            }
    

    })
}


exports.update = (req, res)=>{
    Attendance.findOne({_id: req.params.id}, (err, data)=>{
        if(err) res.status(500).json({'status': false, 'errors': err})
        if(data) {
            Attendance.findOneAndUpdate({_id: req.params.id}, req.body, { runValidators: true, context: 'query', new: true }, (err, data)=>{
                err ? res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)}):
                res.status(200).json({'status': true, 'datas': data})
            })
        }
        else {
            res.status(404).json({'status': false, 'errors': 'Role not found'})
        }
    })
}

exports.update_by_admin = (req, res)=>{
    Attendance.findOne({_id: req.params.id}, (err, data)=>{
        if(err) res.status(500).json({'status': false, 'errors': err})
        if(data) {
            Attendance.findOneAndUpdate({_id: req.params.id}, req.body, { runValidators: true, context: 'query', new: true }, (err, data)=>{
                err ? res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)}):
                res.status(200).json({'status': true, 'datas': data})
            })
        }
        else {
            res.status(404).json({'status': false, 'errors': 'Role not found'})
        }
    })
}

exports.delete =async (req, res)=>{
   return await Attendance.findOne({_id: req.params.id}, (err, data)=>{
        if(err) res.status(500).json({'status': false, 'errors': err})
        if(data) {
            Attendance.deleteOne({_id: req.params.id}, (err, data)=>{
                err ? res.status(500).json({'status': false, 'errors': err}):
                res.status(200).json({'status': true, 'datas': data})
            })
        }
        else {
            res.status(404).json({'status': false, 'errors': 'Role not found'})
        }
    }).clone()
}
