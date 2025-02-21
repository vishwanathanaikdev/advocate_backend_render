const CaseSchema = require("../models/case")
const excelReader = require('../helpers/excel_reader')
const errFormatter = require('../helpers/error.formatter')
const CaseAttachment = require("../models/case_attachment")
const CaseType = require('../models/caseType')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")
const Activity = require('../models/activity')
const excelJS = require("exceljs");



exports.create = async(req,res)=>{
    let body = {...req.body}
    body['created_by'] = req.body.user.id
    if(!['',null,undefined,'null','undefined']?.includes(body.next_hearing_date)){
        body['previous_hearing_date'] = body.next_hearing_date
    }
    await CaseSchema.create(body,(err,data)=>{
          err && res.status(403).send({status:false,err:err})
          data && res.status(201).send({status:true,data:'Created Successfully'})
    })
}
        
exports.get = async(req,res)=>{
    let {page,type='',search='',from_date='',to_date='',step =1} = req.query
    let {id} = req.params
    let roles = req.body.user.roles
    let user = req.body.user.id
    let params = {},skip=0,limit=25,total=0,totalPages=0;

    
    console.log("id here",id)

    if(id !== '' && id !== 'null' && id !== null && id !== undefined){
        if(ObjectId.isValid(id)){
            params = {_id:ObjectId(id)}
        }
    }else{
        if(search !== ''){
            params = {$and:[
                {$or: [
                    {office_file_no:{ $regex: search, '$options': 'i' }},
                    {case_no: { $regex: search, '$options': 'i' } },
                    {parties_name: { $regex: search, '$options': 'i' } },
                    {advocate_for: { $regex: search, '$options': 'i' } },
                    {court_hall: { $regex: search, '$options': 'i' } },
                    {floor: { $regex: search, '$options': 'i' } },
                ]},  
            ]}
        }
    
        if (from_date && to_date) {
            params = { ...params, ...{ createdAt: { $gte: new Date(from_date), $lt: new Date(moment(to_date).add(1, 'd')) } } }
        }

        if(type !== ''){
            const findData = await CaseType.findOne({name:type})
            if(findData !== '' && findData !== 'null' && findData !== null && findData !== undefined){
                params = {...params,case_type:findData._id}
            }
        }
    }


if(id === undefined){
    if(step == 1){
        params = {...params,status:'Pending'}
    }else if(step == 2){
        params = {...params,status:'In Progress'}
    }else if(step == 3){
        params = {...params,status:'Completed'}
    }else if(step == 4){
        params = {...params,status:'Hold'}
    }
}



    if(roles?.includes('admin')){

    }else{
       params ={...params,created_by:ObjectId(user)}
    }

    total = await CaseSchema.find(params).count()

    totalPages = Math.ceil(total/limit)

    console.log("params",params)

    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }

    return await CaseSchema.aggregate([
        {$match:params},
        {
            $lookup:{
                from:"users",
                localField:"created_by",
                foreignField:"_id",
                as:"created_by",
            }
        },
        {
           $unwind:{
            path:"$created_by",
            preserveNullAndEmptyArrays:true
           }
        },
        {
            $lookup:{
                from:"casestages",
                localField:"stage",
                foreignField:"_id",
                as:"stage",
            }
        },
        {
           $unwind:{
            path:"$stage",
            preserveNullAndEmptyArrays:true
           }
        },
        {
            $lookup:{
                from:"casetypes",
                localField:"case_type",
                foreignField:"_id",
                as:"case_type",
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
                from:"clientschemas",
                localField:"client",
                foreignField:"_id",
                as:"client",
            }
        },
        {
           $unwind:{
            path:"$client",
            preserveNullAndEmptyArrays:true
           }
        },
        { $sort: { createdAt: -1 } },
        {$skip:skip},
        {$limit:limit}
    ]).exec((err,datas)=>{
        err && res.status(403).send({status:false,err:err})
        datas && res.status(200).send({status:true,datas:datas,pagination:{total,totalPages,limit}})
    })



    

}

exports.get_admin = async(req,res)=>{
    let {page,type='',search='',from_date='',to_date='',case_hearing_date='',step=''} = req.query
    let {id} = req.params
    let params = {},skip=0,limit=25,total=0,totalPages=0;

    

    if(id !== '' && id !== 'null' && id !== null && id !== undefined){
        if(ObjectId.isValid(id)){
            params = {_id:ObjectId(id)}
        }
    }else{

        params = {$and:[
            {$or: [
                {office_file_no:{ $regex: search, '$options': 'i' }},
                {case_no: { $regex: search, '$options': 'i' } },
                {parties_name: { $regex: search, '$options': 'i' } },
                {advocate_for: { $regex: search, '$options': 'i' } },
                {court_hall: { $regex: search, '$options': 'i' } },
                {floor: { $regex: search, '$options': 'i' } },
            ]},  
        ]}
    
        if (from_date && to_date && !case_hearing_date) {
            params = { ...params, ...{ createdAt: { $gte: new Date(from_date), $lt: new Date(moment(to_date).add(1, 'd')) } } }
        }else if(case_hearing_date){
            params = { ...params, ...{ next_hearing_date: new Date(case_hearing_date)} }
        }

        if(type !== ''){
            const findData = await CaseType.findOne({name:type})
            if(findData !== '' && findData !== 'null' && findData !== null && findData !== undefined){
                params = {...params,case_type:findData._id}
            }
        }
    }


    if(step == 1){
        params = {...params,status:'Pending'}
    }else if(step == 2){
        params = {...params,status:'In Progress'}
    }else if(step == 3){
        params = {...params,status:'Completed'}
    }else if(step == 4){
        params = {...params,status:'Hold'}
    }

    total = await CaseSchema.find(params).count()

    totalPages = Math.ceil(total/limit)


    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }

    return await CaseSchema.aggregate([
        {$match:params},
        {
            $lookup:{
                from:"users",
                localField:"created_by",
                foreignField:"_id",
                as:"created_by",
            }
        },
        {
           $unwind:{
            path:"$created_by",
            preserveNullAndEmptyArrays:true
           }
        },
        {
            $lookup:{
                from:"casestages",
                localField:"stage",
                foreignField:"_id",
                as:"stage",
            }
        },
        {
           $unwind:{
            path:"$stage",
            preserveNullAndEmptyArrays:true
           }
        },
        {
            $lookup:{
                from:"casetypes",
                localField:"case_type",
                foreignField:"_id",
                as:"case_type",
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
                from:"clientschemas",
                localField:"client",
                foreignField:"_id",
                as:"client",
            }
        },
        {
           $unwind:{
            path:"$client",
            preserveNullAndEmptyArrays:true
           }
        },
        { $sort: { createdAt: -1 } },
        {$skip:skip},
        {$limit:limit}
    ]).exec((err,datas)=>{
        err && res.status(403).send({status:false,err:err})
        datas && res.status(200).send({status:true,datas:datas,pagination:{total,totalPages,limit}})
    })



    

}

exports.update = async(req,res)=>{

    let body = {...req.body} 
    let findCase =  await CaseSchema.findById(req.params.id)

    if(!['',null,undefined,'null','undefined']?.includes(findCase.next_hearing_date)){
        body['previous_hearing_date'] = findCase?.next_hearing_date
    }

    await CaseSchema.findByIdAndUpdate(req.params.id,req.body,(err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:'Updated Successfully'})
  }).clone()
}

exports.delete = async (req,res)=>{
    return await CaseSchema.findByIdAndDelete(req.params.id,(err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:'Deleted Successfully'})
    }).clone()
}

exports.delete_all = async (req,res)=>{
    return await CaseSchema.deleteMany({},(err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:'Deleted Successfully'})
    }).clone()
}

exports.filter = async (req,res)=>{
    const {search='',page=1,from_date='',to_date='',type=''} = req.query 

    let params = {}, skip = 0,  totalPages = 1 , total = 0, limit = 25
    
    params = {$and:[
        {$or: [
            {office_file_no:{ $regex: search, '$options': 'i' }},
            {case_no: { $regex: search, '$options': 'i' } },
            {parties_name: { $regex: search, '$options': 'i' } },
            {advocate_for: { $regex: search, '$options': 'i' } },
            {court_hall: { $regex: search, '$options': 'i' } },
            {floor: { $regex: search, '$options': 'i' } },
        ]},  
    ]}

    if (from_date && to_date) {
        params = { ...params, ...{ createdAt: { $gte: new Date(from_date), $lt: new Date(moment(to_date).add(1, 'd')) } } }
    }

    if(type !== ''){
        const findData = await CaseType.findOne({name:type})
        if(findData !== '' && findData !== 'null' && findData !== null && findData !== undefined){
            params = {case_type:findData._id}
        }
    }

    total = await CaseSchema.find(params).count()
    totalPages = Math.ceil(total/limit)


   

    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }


    return await CaseSchema.aggregate([
        {
            $match:params
        },
        {
            $lookup:{
                from:"users",
                localField:"created_by",
                foreignField:"_id",
                as:"created_by",
            }
        },
        {
           $unwind:{
            path:"$created_by",
            preserveNullAndEmptyArrays:true
           }
        },
        {
            $lookup:{
                from:"casestages",
                localField:"stage",
                foreignField:"_id",
                as:"stage",
            }
        },
        {
           $unwind:{
            path:"$stage",
            preserveNullAndEmptyArrays:true
           }
        },
        {
            $lookup:{
                from:"casetypes",
                localField:"case_type",
                foreignField:"_id",
                as:"case_type",
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
                from:"clientschemas",
                localField:"client",
                foreignField:"_id",
                as:"client",
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
                from:"users",
                localField:"created_by",
                foreignField:"_id",
                as:"created_by",
            }
        },
        {
           $unwind:{
            path:"$created_by",
            preserveNullAndEmptyArrays:true
           }
        },
        {$skip:skip},
        {$limit:limit}
    ])
    .exec((err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,datas:data,pagination:{total,totalPages,limit}})
    })
}


exports.filter_date = async (req,res)=>{
    const {search='',page=1,hearing_date='',type=''} = req.query 

    let params = {}, skip = 0,  totalPages = 1 , total = 0, limit = 25
    
    // params = {$and:[
    //     {$or: [
    //         {office_file_no:{ $regex: search, '$options': 'i' }},
    //         {case_no: { $regex: search, '$options': 'i' } },
    //         {parties_name: { $regex: search, '$options': 'i' } },
    //         {advocate_for: { $regex: search, '$options': 'i' } },
    //         {court_hall: { $regex: search, '$options': 'i' } },
    //         {floor: { $regex: search, '$options': 'i' } },
    //     ]},  
    // ]}

    // if (from_date && to_date) {
    //     params = { ...params, ...{ createdAt: { $gte: new Date(from_date), $lt: new Date(moment(to_date).add(1, 'd')) } } }
    // }


    console.log("hearing_date",hearing_date)


    if(!['',null,undefined,'null','undefined']?.includes(hearing_date)){
       let date = new Date(hearing_date)
    //    console.log("date",date)
        params = {...params,next_hearing_date:date}
    }

    // if(['',null,undefined,'null','undefined']?.includes(type)){
    //     const findData = await CaseType.findOne({name:type})
    //     if(findData !== '' && findData !== 'null' && findData !== null && findData !== undefined){
    //         params = {case_type:findData._id}
    //     }
    // }

    total = await CaseSchema.find(params).count()
    totalPages = Math.ceil(total/limit)


   console.log("params",params)

    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }


    return await CaseSchema.aggregate([
        {
            $match:params
        },
        {
            $lookup:{
                from:"users",
                localField:"created_by",
                foreignField:"_id",
                as:"created_by",
            }
        },
        {
           $unwind:{
            path:"$created_by",
            preserveNullAndEmptyArrays:true
           }
        },
        {
            $lookup:{
                from:"casestages",
                localField:"stage",
                foreignField:"_id",
                as:"stage",
            }
        },
        {
           $unwind:{
            path:"$stage",
            preserveNullAndEmptyArrays:true
           }
        },
        {
            $lookup:{
                from:"casetypes",
                localField:"case_type",
                foreignField:"_id",
                as:"case_type",
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
                from:"clientschemas",
                localField:"client",
                foreignField:"_id",
                as:"client",
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
                from:"users",
                localField:"created_by",
                foreignField:"_id",
                as:"created_by",
            }
        },
        {
           $unwind:{
            path:"$created_by",
            preserveNullAndEmptyArrays:true
           }
        },
        {$skip:skip},
        {$limit:limit}
    ])
    .exec((err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,datas:data,pagination:{total,totalPages,limit}})
    })
}


exports.filter_date_excel = async (req,res)=>{

   const workbook = new excelJS.Workbook();  // Create a new workbook
   const worksheet = workbook.addWorksheet("Today Work",{
    pageSetup:{fitToPage: true, fitToHeight: 5, fitToWidth: 7,horizontalCentered:true,verticalCentered:true}
   }); // New Worksheet
   const path = "public/today_work";



    const {search='',page=1,hearing_date='',type=''} = req.query 

    let params = {}, skip = 0,  totalPages = 1 , total = 0, limit = 25
    
    // params = {$and:[
    //     {$or: [
    //         {office_file_no:{ $regex: search, '$options': 'i' }},
    //         {case_no: { $regex: search, '$options': 'i' } },
    //         {parties_name: { $regex: search, '$options': 'i' } },
    //         {advocate_for: { $regex: search, '$options': 'i' } },
    //         {court_hall: { $regex: search, '$options': 'i' } },
    //         {floor: { $regex: search, '$options': 'i' } },
    //     ]},  
    // ]}

    // if (from_date && to_date) {
    //     params = { ...params, ...{ createdAt: { $gte: new Date(from_date), $lt: new Date(moment(to_date).add(1, 'd')) } } }
    // }




    if(!['',null,undefined,'null','undefined']?.includes(hearing_date)){
       let date = new Date(hearing_date)
    //    console.log("date",date)
        params = {...params,next_hearing_date:date}
    }

    // if(['',null,undefined,'null','undefined']?.includes(type)){
    //     const findData = await CaseType.findOne({name:type})
    //     if(findData !== '' && findData !== 'null' && findData !== null && findData !== undefined){
    //         params = {case_type:findData._id}
    //     }
    // }

    total = await CaseSchema.find(params).count()
    totalPages = Math.ceil(total/limit)


   console.log("params",params)

    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }


    return await CaseSchema.aggregate([
        {
            $match:params
        },
        {
            $lookup:{
                from:"users",
                localField:"created_by",
                foreignField:"_id",
                as:"created_by",
            }
        },
        {
           $unwind:{
            path:"$created_by",
            preserveNullAndEmptyArrays:true
           }
        },
        {
            $lookup:{
                from:"casestages",
                localField:"stage",
                foreignField:"_id",
                as:"stage",
            }
        },
        {
           $unwind:{
            path:"$stage",
            preserveNullAndEmptyArrays:true
           }
        },
        {
            $lookup:{
                from:"casetypes",
                localField:"case_type",
                foreignField:"_id",
                as:"case_type",
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
                from:"clientschemas",
                localField:"client",
                foreignField:"_id",
                as:"client",
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
                from:"users",
                localField:"created_by",
                foreignField:"_id",
                as:"created_by",
            }
        },
        {
           $unwind:{
            path:"$created_by",
            preserveNullAndEmptyArrays:true
           }
        },
        {$skip:skip},
        {$limit:limit},
        {
            $project:{
                    "court_hall":'$court_hall',
                    "case_no":'$case_no' ,
                    "stage":'$stage.name',
                    "next_hearing_date":'$next_hearing_date',
                    "previous_hearing_date":'$previous_hearing_date',
                   
            }
        }
    ])
    .exec(async(err,datas)=>{

        worksheet.columns = [
            { header: "Sl No.", key: "s_no", width: 10 }, 
            { header: "Previous Hearing Date", key: "previous_hearing_date", width: 20 },
            { header: "Court Hall", key: "court_hall", width: 30 },
            { header: "Particulars (Case No) ", key: "case_no", width: 20 },
            { header: "Stage", key: "stage", width: 20 },
            { header: "Next Hearing Date", key: "next_hearing_date", width: 20 },
            { header: "Date ", key: "", width: 15 },
            { header: "Remarks", key: "", width: 40 },
          
        ];

        let counter = 1
        datas.forEach((user) => {
            user.s_no = counter;
            worksheet.addRow(user); // Add data in worksheet
            counter++;
          });
    
          worksheet.eachRow(function (row, rowNumber) {
    
            row.eachCell((cell, colNumber) => {
                if (rowNumber == 1) {
                    // First set the background of header row
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'e6e6e6' }
                    }
                }
                // Set border of each cell 
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            })
            //Commit the changed row to the stream
            row.commit();
        });

        try {
            const data = await workbook.xlsx.writeFile(`${path}/today_work.xlsx`)
             .then(() => {
               res.send({
                 status: "success",
                 message: "file successfully downloaded",
                 path: `${path}/today_work.xlsx`,
                });
             });
          } catch (err) {
              res.send({
              status: "error",
              message: "Something went wrong",
            });
            }
    
    
       })
      
}


exports.upload_excel =  (upload,multer) =>{
    return (req, res) => {
        let user = req.body.user

        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError || err) {
                return res.status(500).json({'status': false, 'errors': err});
            }
            else if(req.fileValidationError) {
                return res.status(422).json({'status': false, 'errors': req.fileValidationError})
            }
            
            let headers = [
                'Name', 
                'Mobile', 
                'Email', 
                'Address', 
                'Site No', 
                'Site Info', 
                'Stage', 
                'Village', 
                'Survey No', 
                'Category', 
                'Extent', 
                'Katha', 
                'Registration Date', 
                'Comments',
                'Phase'

            ]



            let read = excelReader.readExcel(req.file, headers)

            if (read) {
                if('status' in read && !read.status) {
                    return res.status(422).json(read) 
                }
                // let userDepartment = await User.findOne({_id: user.id}).exec()
                let errors = []
                for (const item of read) {
                   let createData
                    try {
                        createData = {
                            name:item['Name'],
                            mobile:item['Mobile'],
                            email:(item['Email'] !== '' && item['Email'] !== undefined) ? item['Email'] : '',
                            address:(item['Address'] !== '' && item['Address'] !== undefined) ? item['Address'] : '',
                            aadhar_no:'',
                            pan_no:'',
                            photo:'',
                            aadhar_file:'',
                            pan_file:'',
                            dl_file:'',
                            site_no:item['Site No'],
                            site_info:item['Site Info'],
                            muda_docs:'',
                            stage:(item['Stage'] !== '' && item['Stage'] !== undefined) ? item['Stage'] : '',
                            village:(item['Village'] !== '' && item['Village'] !== undefined) ? item['Village'] : '',
                            survey_no:(item['Survey No'] !== '' && item['Survey No'] !== undefined) ? item['Survey No'] : '',
                            category:(item['Category'] !== '' && item['Category'] !== undefined) ? item['Category'] : '',
                            extent:(item['Extent'] !== '' && item['Extent'] !== undefined) ? item['Extent'] : '',
                            katha:(item['Katha'] !== '' && item['Katha'] !== undefined) ? item['Katha'] : false,
                            registration_date:(item['Registration Date'] !== '' && item['Registration Date'] !== undefined) ? new Date(item['Registration Date']) : '',
                            document_lost_phase:(item['Phase'] !== '' && item['Phase'] !== undefined) ? item['Phase'] : '',
                            created_by:user.id,
                            secondary_name:'',
                            secondary_contact:'',
                            comments:item['Comments'] ,
                            sales_deed:'',
                            noc:'',
                            voter_id:'',
                            ration_card:''
                        }

                        
                        
                            let data1 = await CaseSchema.create(createData)                      
                    } catch (err) {
                        errors.push({
                            not_created: {...createData},
                            errors: errFormatter.formatError(err.message)
                        })
                    }
                }
                     errors.length ? res.status(500).json({'status': true, 'msg': errors}) :
                    res.status(201).json({'status': true, 'msg': 'Successfully added'})
            } else {
                res.status(422).json(read)
            }
        })     
    }   
}

exports.fileUpload = (req,res)=>{
    return res.status(200).send({status:true,data:req.file.key})
} 

exports.updateNextHearingDateMax = async (req,res)=>{
    let datas = [...req.body.selected]
    let date = req.body.next_hearing_date
    
    async function updatemass(){
        let completeData = new Promise(async(resolve, reject) => {
        
            if(datas.length === 0){
                resolve()
            }else{
                datas.forEach(async(d,i)=>{
                    let caseData = await CaseSchema.findById(d)
                    if(caseData !== null){
                        await CaseSchema.findByIdAndUpdate(d,{next_hearing_date:date})
                        let sendData = {
                            created_by:req.body.user.id,
                            case:d,
                            client:caseData.client,
                            stage:caseData.stage,
                            remarks:"Mass Updated on Next Hearing Date",
                            next_hearing_date:date,
                            type:'case'
                        }
                        await Activity.create(sendData)
                    }

                    if(i == (datas.length-1)){
                        resolve()
                    }
                })
            }
        })

        return completeData
    }

    await updatemass().then((data)=>{
        res.status(200).send({status:true,data:"Updated Successfully"})
    })
}

exports.upload_case_attachment_file = async(req,res)=>{
    let body = {...req.body}
    body['created_by'] = req.body.user.id
    await CaseAttachment.create(req.body,(err,data)=>{
          err && res.status(403).send({status:false,err:err})
          data && res.status(200).send({status:true,data:'Created Successfully'})
    })
}