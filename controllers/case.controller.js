const CaseSchema = require("../models/case")
const excelReader = require('../helpers/excel_reader')
const errFormatter = require('../helpers/error.formatter')
const CaseAttachment = require("../models/case_attachment")
const CaseType = require('../models/caseType')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")



exports.create = async(req,res)=>{
    let body = {...req.body}
    body['created_by'] = req.body.user.id
    await CaseSchema.create(req.body,(err,data)=>{
          err && res.status(403).send({status:false,err:err})
          data && res.status(201).send({status:true,data:'Created Successfully'})
    })
}
        
exports.get = async(req,res)=>{
    let {page,type='',search='',from_date='',to_date='',step =1} = req.query
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
    ]).exec((err,datas)=>{
        err && res.status(403).send({status:false,err:err})
        datas && res.status(200).send({status:true,datas:datas,pagination:{total,totalPages,limit}})
    })



    

}

exports.update = async(req,res)=>{
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


exports.upload_case_attachment_file = async(req,res)=>{
    let body = {...req.body}
    body['created_by'] = req.body.user.id
    await CaseAttachment.create(req.body,(err,data)=>{
          err && res.status(403).send({status:false,err:err})
          data && res.status(200).send({status:true,data:'Created Successfully'})
    })
}