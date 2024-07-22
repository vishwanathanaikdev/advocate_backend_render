const Bills = require('../models/bills')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')


exports.get = async (req, res)=>{
    let {type} = req.query
    let {id} = req.params

    let params = {}
    
    if(ObjectId.isValid(id)){
        if(type === 'case'){
            params = {case:ObjectId(id)}
        }else if(type === 'opinion_file'){
            params = {opinion_file:ObjectId(id)}
        }
    }

    return await Bills.find(params).populate('created_by').exec((err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:data})
    })
}

exports.getbills = async (req,res)=>{

    let params={},total=0,totalPages=0,skip=0,limit=25;
    let {page=1,from_date,to_date} = req.query

    if (from_date && to_date) {
        params = { ...params, ...{ createdAt: { $gte: new Date(from_date), $lt: new Date(moment(to_date).add(1, 'd')) } } }
    }

    total = await Bills.find(params).count()

    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }

    totalPages = Math.ceil(total/limit)


    return await Bills.aggregate([
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
                from:"caseschemas",
                localField:"case",
                foreignField:"_id",
                pipeline:[
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
                ],
                as:"case",
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
                from:"opinionfileschemas",
                localField:"opinion_file",
                foreignField:"_id",
                pipeline:[
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
                ],
                as:"opinion_file",
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
                from:"payments",
                localField:"_id",
                foreignField:"bill",
                as:'payments'
            }
        },
        {
            $project:{
             _id:1,
             amountWithGst:1,
             amountWithoutGst:1,
             bill_id:1,
             bill_info:1,
             completedPaymentRecieved:1,
             createdAt:1,
             created_by:1,
             date:1,
             file:1,
             opinion_file:1,
             case:1,
             type:1,
             payment_recieved:{$sum:"$payments.amountWithGst"},
            }
        }
    ]).exec((err,datas)=>{
        err && res.status(403).send({status:false,err:err})
        datas && res.status(403).send({status:true,datas:datas,pagination:{total,totalPages,limit}})
    })

}

exports.create = async(req,res)=>{
    let body = {...req.body}
    body['created_by'] = req.body.user.id
    return await Bills.create(body, (err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(201).send({status:true,data:data})
    })
}

exports.update = async(req,res)=>{
    let body = {...req.body}
    return await Bills.findByIdAndUpdate(req.params.id,body,{new:true}, (err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(201).send({status:true,data:data})
    }).clone()     
}

exports.delete =async (req, res)=>{
    return await Bills.findByIdAndDelete(req.params.id, (err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:data})
    }).clone() 
}
