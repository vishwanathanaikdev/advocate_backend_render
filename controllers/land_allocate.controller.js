const LandAllocate = require("../models/land_allocate")
const excelReader = require('../helpers/excel_reader')
const errFormatter = require('../helpers/error.formatter')
const LandAllocateAttachment = require("../models/land_allocate_attachment")
const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")



exports.create = (upload,multer)=>{
        let photo;
        let aadhar_file;
        let pan_file;
        let dl_file;
        let muda_file;
        let noc;
        let sales_deed;
        let voter_id;
        let ration_card;
        let death_certificate;
        let family_tree;
        let andiment;
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
                if(req.files.muda_file !== undefined) {
                    muda_file = req.files.muda_file[0].path.includes("public\\")?req.files.muda_file[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.muda_file[0].path.split('public/')[1]
                }
                if(req.files.sales_deed !== undefined) {
                    sales_deed = req.files.sales_deed[0].path.includes("public\\")?req.files.sales_deed[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.sales_deed[0].path.split('public/')[1]
                }
                if(req.files.noc !== undefined) {
                    noc = req.files.noc[0].path.includes("public\\")?req.files.noc[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.noc[0].path.split('public/')[1]
                }

                if(req.files.voter_id !== undefined) {
                    voter_id = req.files.voter_id[0].path.includes("public\\")?req.files.voter_id[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.voter_id[0].path.split('public/')[1]
                }

                if(req.files.ration_card !== undefined) {
                    ration_card = req.files.ration_card[0].path.includes("public\\")?req.files.ration_card[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.ration_card[0].path.split('public/')[1]
                }

                if(req.files.death_certificate !== undefined) {
                    death_certificate = req.files.death_certificate[0].path.includes("public\\")?req.files.death_certificate[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.death_certificate[0].path.split('public/')[1]
                }

                if(req.files.family_tree !== undefined) {
                    family_tree = req.files.family_tree[0].path.includes("public\\")?req.files.family_tree[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.family_tree[0].path.split('public/')[1]
                }

                if(req.files.andiment !== undefined) {
                    andiment = req.files.andiment[0].path.includes("public\\")?req.files.andiment[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.andiment[0].path.split('public/')[1]
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
                if(muda_file !== undefined){
                    body['muda_docs'] = `${muda_file}`
                }
                if(sales_deed !== undefined && sales_deed !== null){
                    body['sales_deed'] = `${sales_deed}`
                }
                if(noc !== undefined){
                    body['noc'] = `${noc}`
                }
                if(voter_id !== undefined){
                    body['voter_id'] = `${voter_id}`
                }

                if(ration_card !== undefined){
                    body['ration_card'] = `${ration_card}`
                }

                if(death_certificate !== undefined){
                    body['death_certificate'] = `${death_certificate}`
                }

                if(family_tree !== undefined){
                    body['family_tree'] = `${family_tree}`
                }

                if(andiment !== undefined){
                    body['andiment'] = `${andiment}`
                }

                await LandAllocate.create(body,(err,data)=>{
                      console.log("err",err)
                      err && res.status(403).send({status:false,err:err})

                      if(data){
                         if(req.files !== undefined && req.files.files !== undefined  && req.files.files.length > 0){
                            let other_files = req.files.files
                            other_files.forEach((d)=>{
                                LandAllocateAttachment.create({land_allocated:data._id,name:d.originalname,file:d.path.includes("public\\")?d.path.split('public\\')[1].replace(/\\/gi,'/'):d.path.split('public/')[1]},(err,data)=>{})
                            })
                            res.status(201).send({status:true,data:'Created Successfully'})
                         }else{
                            res.status(201).send({status:true,data:'Created Successfully'})
                         }
                      }
                })
        }
        
        })    
    }
}

exports.get = async(req,res)=>{
    let {page} = req.query
    let {id} = req.params
    let params = {},skip=0,limit=25,total=0,totalPages=0;

    if(id !== '' && id !== 'null' && id !== null && id !== undefined){
        if(ObjectId.isValid(id)){
            params = {_id:ObjectId(id)}
        }
    }

    total = await LandAllocate.find(params).count()

    totalPages = Math.ceil(total/limit)


    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }

    return await LandAllocate.aggregate([
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
     let muda_file;
     let noc;
     let sales_deed;
     let voter_id;
     let ration_card;
     let death_certificate;
     let family_tree;
     let andiment;
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

             if(req.files.muda_file !== undefined) {
                 muda_file = req.files.muda_file[0].path.includes("public\\")?req.files.muda_file[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.muda_file[0].path.split('public/')[1]
             }

             if(req.files.sales_deed !== undefined) {
                sales_deed = req.files.sales_deed[0].path.includes("public\\")?req.files.sales_deed[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.sales_deed[0].path.split('public/')[1]
             }

             if(req.files.noc !== undefined) {
                noc = req.files.noc[0].path.includes("public\\")?req.files.noc[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.noc[0].path.split('public/')[1]
             }

             if(req.files.voter_id !== undefined) {
                voter_id = req.files.voter_id[0].path.includes("public\\")?req.files.voter_id[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.voter_id[0].path.split('public/')[1]
            }

            if(req.files.ration_card !== undefined) {
                ration_card = req.files.ration_card[0].path.includes("public\\")?req.files.ration_card[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.ration_card[0].path.split('public/')[1]
            }

            if(req.files.death_certificate !== undefined) {
                death_certificate = req.files.death_certificate[0].path.includes("public\\")?req.files.death_certificate[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.death_certificate[0].path.split('public/')[1]
            }

            if(req.files.family_tree !== undefined) {
                family_tree = req.files.family_tree[0].path.includes("public\\")?req.files.family_tree[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.family_tree[0].path.split('public/')[1]
            }

            if(req.files.andiment !== undefined) {
                andiment = req.files.andiment[0].path.includes("public\\")?req.files.andiment[0].path.split('public\\')[1].replace(/\\/gi,'/'):req.files.andiment[0].path.split('public/')[1]
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
             if(muda_file !== undefined){
                 body['muda_docs'] = `${muda_file}`
             }
             if(sales_deed !== undefined){
                body['sales_deed'] = `${sales_deed}`
             }
             if(noc !== undefined){
                body['noc'] = `${noc}`
             }
             if(voter_id !== undefined){
                body['voter_id'] = `${voter_id}`
            }
            if(ration_card !== undefined){
                body['ration_card'] = `${ration_card}`
            }
            if(death_certificate !== undefined){
                body['death_certificate'] = `${death_certificate}`
            }
            if(family_tree !== undefined){
                body['family_tree'] = `${family_tree}`
            }
            if(andiment !== undefined){
                body['andiment'] = `${andiment}`
            }

             await LandAllocate.findByIdAndUpdate(req.params.id,body,(err,data)=>{
                   err && res.status(403).send({status:false,err:err})
                   if(data){
                    if(req.files !== undefined && req.files.files !== undefined && req.files.files.length > 0){
                       let other_files = req.files.files
                       other_files.forEach((d)=>{
                           LandAllocateAttachment.create({land_allocated:data._id,name:d.originalname,file:d.path.includes("public\\")?d.path.split('public\\')[1].replace(/\\/gi,'/'):d.path.split('public/')[1]},(err,data)=>{})
                       })
                       res.status(201).send({status:true,data:'Updated Successfully'})
                    }else{
                       res.status(201).send({status:true,data:'Updated Successfully'})
                    }
                 }

             }).clone()
     }
     })    
    } 
}

exports.delete = async (req,res)=>{
    return await LandAllocate.findByIdAndDelete(req.params.id,(err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:'Deleted Successfully'})
    }).clone()
}

exports.delete_all = async (req,res)=>{
    return await LandAllocate.deleteMany({},(err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:'Deleted Successfully'})
    }).clone()
}

exports.filter = async (req,res)=>{
    const {search,page,from_date,to_date} = req.query 

    let params = {}, skip = 0,  totalPages = 1 , total = 0, limit = 25
    
    params = {$and:[
        {$or: [
            {site_no:{ $regex: search, '$options': 'i' }},
            {name: { $regex: search, '$options': 'i' } },
            {mobile: { $regex: search, '$options': 'i' } },
            {email: { $regex: search, '$options': 'i' } },
            {address: { $regex: search, '$options': 'i' } },
            {extent: { $regex: search, '$options': 'i' } },
            {category: { $regex: search, '$options': 'i' } },
            {survey_no: { $regex: search, '$options': 'i' } },
            {village: { $regex: search, '$options': 'i' } },
        ]},  
    ]}

    if (from_date && to_date) {
        params = { ...params, ...{ createdAt: { $gte: new Date(from_date), $lt: new Date(moment(to_date).add(1, 'd')) } } }
    }

    total = await LandAllocate.find(params).count()
    totalPages = Math.ceil(total/limit)


   

    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }


    return await LandAllocate.aggregate([
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
                'Purchased',
                'Purchased From',
            ]

            // console.log("req.body kp ",req.body.user)


            let read = excelReader.readExcel(req.file, headers)

            if (read) {
                if('status' in read && !read.status) {
                    return res.status(422).json(read) 
                }
                // let userDepartment = await User.findOne({_id: user.id}).exec()
                let errors = []
                for (const item of read) {
                    console.log("item",item['Registration Date'])
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
                            created_by:user.id,
                            secondary_name:'',
                            secondary_contact:'',
                            comments:item['Comments'] ,
                            sales_deed:'',
                            noc:'',
                            voter_id:'',
                            ration_card:''
                        }

                        // console.log("createData",createData)
                        
                        
                            let data1 = await LandAllocate.create(createData)                      
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