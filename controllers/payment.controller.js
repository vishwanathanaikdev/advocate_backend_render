const Payment = require('../models/payment')
const ObjectId = require('mongoose').Types.ObjectId

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

    console.log("params",params)
    return await Payment.find(params).populate('created_by').exec((err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:data})
    })
}

exports.create = async(req,res)=>{
    let body = {...req.body}
    body['created_by'] = req.body.user.id
    return await Payment.create(body, (err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(201).send({status:true,data:data})
    })
}

exports.update = async(req,res)=>{
    let body = {...req.body}
    return await Payment.findByIdAndUpdate(req.params.id,body,{new:true}, (err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(201).send({status:true,data:data})
    }).clone()     
}

exports.delete =async (req, res)=>{
    return await Payment.findByIdAndDelete(req.params.id, (err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:data})
    }).clone() 
}
