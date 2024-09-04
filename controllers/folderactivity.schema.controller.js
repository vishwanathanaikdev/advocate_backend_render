const FolderActivitySchema = require("../models/folderSchemaActivity")
const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")



exports.create = async(req,res)=>{
    let body = {...req.body}
    body['created_by'] = req.body.user.id
    await FolderActivitySchema.create(body,(err,data)=>{
          err && res.status(403).send({status:false,err:err})
          data && res.status(201).send({status:true,data:'Created Successfully'})
    })
}
        
exports.get = async(req,res)=>{
    let {page,search='',from_date='',to_date='',} = req.query
    let {id} = req.params
    let params = {},skip=0,limit=50,total=0,totalPages=0;

    

    if(id !== '' && id !== 'null' && id !== null && id !== undefined){
        if(ObjectId.isValid(id)){
            params = {_id:ObjectId(id)}
        }
    }else{
       
        if(search !== ''){
            params = {$and:[
                {$or: [
                    {name:{ $regex: search, '$options': 'i' }},
                    {file: { $regex: search, '$options': 'i' } },
                ]},  
            ]}
        }
    }



    if(from_date && to_date){
        params = { ...params, ...{ createdAt: { $gte: new Date(from_date), $lt: new Date(moment(to_date).add(1, 'd')) } } }
    }

   

    total = await FolderActivitySchema.find(params).count()

    totalPages = Math.ceil(total/limit)


    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }

    console.log("params",params)

    return await FolderActivitySchema.aggregate([
        // {$match:params},
        {$sort:{createdAt:-1}},
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
                from:"folderschemas",
                localField:"driveItem",
                foreignField:"_id",
                as:"driveItem",
            }
        },
        {
            $unwind:{
                path:"$driveItem",
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
    await FolderActivitySchema.findByIdAndUpdate(req.params.id,req.body,{new:true},(err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:'Updated Successfully'})
  }).clone()
}

exports.delete = async (req,res)=>{
    return await FolderActivitySchema.findByIdAndDelete(req.params.id,(err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:'Deleted Successfully'})
    }).clone()
}

