const Activity = require('../models/activity')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')

exports.create = async(req,res)=>{
    let body = {...req.body}
    body['created_by'] = req.body.user.id
    return await Activity.create(body, (err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(201).send({status:true,data:data})
    })
}

exports.update = async(req,res)=>{
    let body = {...req.body}
    return await Activity.findByIdAndUpdate(req.params.id,body,{new:true},(err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:data})
    }).clone()
}

exports.delete = async(req,res)=>{
    return await Activity.findByIdAndDelete(req.params.id,(err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:data})
    }).clone()
}

exports.get = async(req,res)=>{

    let {type='case',id=''} = req.query
    let params = {}
    
    if(type == 'case'){
        params = {type:'case'}
    }else{
        params = {type:'opinion_file'}
    }

    if(ObjectId.isValid(id)){
        if(type == 'case'){
            params = {...params,case:ObjectId(id)}
        }else if(type == 'opinion_file'){
            params = {...params,opinion_file:ObjectId(id)}
        }
    }

   
    return await Activity.aggregate([
        {
            $match:params
        },
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
                from:'caseschemas',
                localField:'case',
                foreignField:'_id',
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
                as:'opinion_file'
            }
        },
        {
            $unwind:{
                path:"$opinion_file",
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
        },
    ]).exec((err,datas)=>{
        err && res.status(403).send({status:false,err:err})
        datas && res.status(200).send({status:true,datas:datas})
    })
}