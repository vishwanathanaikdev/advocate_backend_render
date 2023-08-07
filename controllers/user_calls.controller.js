const UserCalls = require('../models/user_calls')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')

exports.get = async (req, res)=>{

    // console.log("req.body.user",req.body.user)

    let total = 0;skip=0;limit=25;totalPages=0;
    let {page} = req.query

    let {id} = req.params

    let params = {}

    if(req.body.user.roles.includes('manager')){
        if(id && ObjectId.isValid(id)){
            params = {_id:ObjectId(id)}
        }else{
            params = {}
        }
    }else{
        if(id && ObjectId.isValid(id)){
            params = {_id:ObjectId(id),created_by:ObjectId(req.body.user.id)}
        }else{
            params = {created_by:ObjectId(req.body.user.id)}
        }
    }
    


    total = await UserCalls.find(params).count()

    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }

    totalPages = Math.ceil(total/limit)

    return await UserCalls.aggregate([
        {$match:params},
        {
            $skip:skip
        },{
            $limit:limit
        }
    ]).exec((err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,datas:data,pagination:{total,totalPages,limit}})
    })
}

exports.create = (req, res)=>{
    let body = {...req.body}
    body['created_by'] = req.body.user.id
    UserCalls.create(body, (err, data)=>{
        err ? res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)}):
        res.status(201).json({'status': true, 'datas': "Created Successfully"})
    })
}

exports.update = (req, res)=> {
    UserCalls.findByIdAndUpdate(req.params.id, {...req.body}, {new: true }, (err, data)=>{
        err ? res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)}):
        res.status(200).json({'status': true, 'datas': "Updated Successfully"})
    })
       
}

exports.delete = (req, res)=> {
    UserCalls.findByIdAndDelete(req.params.id,(err, data)=>{
        err ? res.status(422).json({'status': false, 'errors':err}):
        res.status(200).json({'status': true, 'datas': "Deleted Successfully"})
    })
}

exports.filter = async (req, res)=>{

    const {search,page,from_date,to_date} = req.query 

    let params = {}, skip = 0,  totalPages = 1 , total = 0, limit = 25
    
    params = {$and:[
        {$or: [
            {name: { $regex: search, '$options': 'i' } },
            {phone: { $regex: search, '$options': 'i' } },
            {type: { $regex: search, '$options': 'i' } },
        ]},  
    ]}

    if (from_date && to_date) {
        params = { ...params, ...{ createdAt: { $gte: new Date(from_date), $lt: new Date(moment(to_date).add(1, 'd')) } } }
    }


    if(req.body.user.roles.includes('manager')){
    }else{
        if(id && ObjectId.isValid(id)){
            params = {...params,_id:ObjectId(id),created_by:ObjectId(req.body.user.id)}
        }else{
            params = {...params,created_by:ObjectId(req.body.user.id)}
        }
    }

    total = await UserCalls.find(params).count()
    totalPages = Math.ceil(total/limit)


   

    if(!page || page == 1){
        skip = 0
    }else{
        skip = (page - 1) * limit
    }



    

    return await UserCalls.aggregate([
        {$match:params},
        {
            $skip:skip
        },{
            $limit:limit
        }
    ]).exec((err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,datas:data,pagination:{total,totalPages,limit}})
    })
}
