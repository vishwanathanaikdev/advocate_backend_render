const CaseAttachment = require('../models/case_attachment')
const errFormatter = require('../helpers/error.formatter')

exports.get = async (req, res)=>{
    return await CaseAttachment.find(({case:req.params.id}), (err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:data})
    }).clone() 
}

exports.create = async(req,res)=>{
    let body = {...req.body}
    body['created_by'] = req.body.user.id
    return await CaseAttachment.create(body, (err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(201).send({status:true,data:data})
    })
}

exports.update = async(req,res)=>{
    let body = {...req.body}
    return await CaseAttachment.findByIdAndUpdate(req.params.id,body,{new:true}, (err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(201).send({status:true,data:data})
    }).clone()     
}

exports.delete =async (req, res)=>{
    return await CaseAttachment.findByIdAndDelete(req.params.id, (err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:data})
    }).clone() 
}
