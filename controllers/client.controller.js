const ClientSchema = require("../models/client")
const excelReader = require('../helpers/excel_reader')
const errFormatter = require('../helpers/error.formatter')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")



exports.create = (upload,multer)=>{
        let photo;
        let aadhar_file;
        let pan_file;
        let dl_file;
        return (req,res)=>{
        let user_id = req.body.user.id
        upload(req,res, async(err)=>{

            if (req.fileValidationError) {
                return res.status(422).json({'status': false,'errors': req.fileValidationError})
            }
            else if (err instanceof multer.MulterError || err) {
                return res.status(422).json({'status': false,'errors': err})
            }
            else {
                
                if(req.files.photo !== undefined) {
                    photo = req.files.photo[0].path.includes("public\\")?req.files.photo[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.photo[0].path.split('public/')[1]
                }

                if(req.files.aadhar_file !== undefined) {
                    aadhar_file = req.files.aadhar_file[0].path.includes("public\\")?req.files.aadhar_file[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.aadhar_file[0].path.split('public/')[1]
                }
                if(req.files.pan_file !== undefined) {
                    pan_file = req.files.pan_file[0].path.includes("public\\")?req.files.pan_file[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.pan_file[0].path.split('public/')[1]
                }
                if(req.files.dl_file !== undefined) {
                    dl_file = req.files.dl_file[0].path.includes("public\\")?req.files.dl_file[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.dl_file[0].path.split('public/')[1]
                }
               

                var body =  Object.assign(req.body)
                body['created_by'] = user_id
                
                if(photo !== undefined){
                    body['photo'] = `${photo}`
                }
                if(aadhar_file !== undefined){
                    body['aadhar_file'] = `${aadhar_file}`
                }
                if(pan_file !== undefined){
                    body['pan_file'] = `${pan_file}`
                }
                if(dl_file !== undefined){
                    body['dl_file'] = `${dl_file}`
                }
                
                await ClientSchema.create(body,(err,data)=>{
                      err && res.status(403).send({status:false,err:err})

                      if(data){
                        
                        res.status(201).send({status:true,data:'Client Created Successfully'})
                         
                      }
                })
        }
        
        })    
    }
}

exports.get = async(req,res)=>{
    let {page,type} = req.query
    let {id} = req.params
    let roles = req.body.user.roles
    let user = req.body.user.id
    let params = {},skip=0,limit=25,total=0,totalPages=0;

    if(id !== '' && id !== 'null' && id !== null && id !== undefined){
        if(ObjectId.isValid(id)){
            params = {_id:ObjectId(id)}
        }
    }else{
        if(type !== undefined && type !== null && type !== ''){
            params={is_active:type === 'in_active' ? false : true}
        }
    }

    if(roles?.includes('admin')){
    }else{
       params ={...params,created_by:ObjectId(user)}
    }

    total = await ClientSchema.find(params).count()

    totalPages = Math.ceil(total/limit)


    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }

    return await ClientSchema.aggregate([
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
        {$skip:skip},
        {$limit:limit}
    ]).exec((err,datas)=>{
        err && res.status(403).send({status:false,err:err})
        datas && res.status(200).send({status:true,datas:datas,pagination:{total,totalPages,limit}})
    })



    

}

exports.update = (upload,multer)=>{
    let photo;
     let aadhar_file;
     let pan_file;
     let dl_file;
     
     return (req,res)=>{
     upload(req,res, async(err)=>{
         if (req.fileValidationError) {
             return res.status(422).json({'status': false,'errors': req.fileValidationError})
         }
         else if (err instanceof multer.MulterError || err) {
             return res.status(422).json({'status': false,'errors': err})
         }
         else {
             
             if(req.files.photo !== undefined) {
                 photo = req.files.photo[0].path.includes("public\\")?req.files.photo[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.photo[0].path.split('public/')[1]
             }

             if(req.files.aadhar_file !== undefined) {
                 aadhar_file = req.files.aadhar_file[0].path.includes("public\\")?req.files.aadhar_file[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.aadhar_file[0].path.split('public/')[1]
             }
             if(req.files.pan_file !== undefined) {
                 pan_file = req.files.pan_file[0].path.includes("public\\")?req.files.pan_file[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.pan_file[0].path.split('public/')[1]
             }
             if(req.files.dl_file !== undefined) {
                 dl_file = req.files.dl_file[0].path.includes("public\\")?req.files.dl_file[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.dl_file[0].path.split('public/')[1]
             }

            
            

             var body =  Object.assign(req.body)
             
             if(photo !== undefined){
                 body['photo'] = `${photo}`
             }
             if(aadhar_file !== undefined){
                 body['aadhar_file'] = `${aadhar_file}`
             }
             if(pan_file !== undefined){
                 body['pan_file'] = `${pan_file}`
             }
             if(dl_file !== undefined){
                 body['dl_file'] = `${dl_file}`
             }
            

             await ClientSchema.findByIdAndUpdate(req.params.id,body,(err,data)=>{
                   err && res.status(403).send({status:false,err:err})
                   if(data){
                       res.status(200).send({status:true,data:'Updated Successfully'})
                    }

             }).clone()
     }
     })    
    } 
}

exports.delete = async (req,res)=>{
    return await ClientSchema.findByIdAndDelete(req.params.id,(err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:'Deleted Successfully'})
    }).clone()
}

exports.delete_all = async (req,res)=>{
    return await ClientSchema.deleteMany({},(err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:'Deleted Successfully'})
    }).clone()
}

exports.filter = async (req,res)=>{
    const {search,page,from_date,to_date,type='active'} = req.query 
   

    let params = {}, skip = 0,  totalPages = 1 , total = 0, limit = 25
    
    params = {$and:[
        {$or: [
            {name: { $regex: search, '$options': 'i' } },
            {mobile: { $regex: search, '$options': 'i' } },
            {email: { $regex: search, '$options': 'i' } },
            {address: { $regex: search, '$options': 'i' } }
        ]},  
    ]}

    if(type == 'active'){
        params = {...params,is_active:true}
    }else{
        params = {...params,is_active:false}
    }

    if (from_date && to_date) {
        params = { ...params, ...{ createdAt: { $gte: new Date(from_date), $lt: new Date(moment(to_date).add(1, 'd')) } } }
    }

    total = await ClientSchema.find(params).count()
    totalPages = Math.ceil(total/limit)


   

    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }


    return await ClientSchema.aggregate([
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
                'Aadhar No',
                'Pan No',
                'Client Type',
                'Secondary Name',
                'Secondary Contact',
                'Comments'
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
                            aadhar_no:item['Aadhar No'],
                            pan_no:item['Pan No'],
                            photo:'',
                            aadhar_file:'',
                            pan_file:'',
                            dl_file:'',
                            created_by:user.id,
                            secondary_name:item['Secondary Name'],
                            secondary_contact:item['Secondary Contact'],
                            comments:item['Comments'] ,
                        }

                        
                        
                            let data1 = await ClientSchema.create(createData)                      
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