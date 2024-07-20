const CaseStage = require('../models/caseStage')
const errFormatter = require('../helpers/error.formatter')
const ObjectId = require('mongoose').Types.ObjectId

exports.get = async(req, res)=>{
    const {page=1,id=''} = req.query

    let params = {}, limit = 25, skip = (page - 1) * limit, total = 0, totalPages = 0

    if(id !== '' && ObjectId.isValid(id)){
        params = {case_type:ObjectId(id)}
    }

    total = await CaseStage.find(params).count()

    totalPages = Math.ceil(total/limit)

    await CaseStage.aggregate([
        {$match: {...params}},
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
        {$sort: { createdAt: -1 }},
        {$skip:skip},
        {$limit:limit},

    ]).exec((err,datas)=>{
        err ? res.status(422).json({'status': false, 'errors':errFormatter.formatError(err.message)}):
        res.status(200).json({'status':true, 'datas': datas,'pagination':{total,limit,totalPages}})
    })
}

exports.create = (req, res)=>{
    CaseStage.create(req.body, (err, data)=>{
        err ? res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)}):
        res.status(201).json({'status': true, 'datas': data})
    })
}

exports.update = (req, res)=> {
    let casestageData = Object.assign({}, req.body)
    CaseStage.findOne({_id: req.params.id}, (err, data)=>{
        if(err) res.status(500).json({'status': false, 'errors': err})
        if(data) {
            CaseStage.findOneAndUpdate({_id: req.params.id}, casestageData, { runValidators: true, context: 'query', new: true }, (err, data)=>{
                err ? res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)}):
                res.status(200).json({'status': true, 'datas': data})
            })
        }
        else {
            res.status(404).json({'status': false, 'errors': 'CaseStage not found'})
        }
    })
}

exports.delete = (req, res)=> {
    return CaseStage.findOne({_id: req.params.id}, (err, data)=>{
        if(err) return res.status(500).json({'status': false, 'errors': err})
        if(data) {
            CaseStage.deleteOne({_id: req.params.id}, (err, data)=>{
                err ? res.status(500).json({'status': false, 'errors': err}):
                res.status(200).json({'status': true, 'datas': 'CaseStage successfully'})
            })
        }
        else {
            res.status(404).json({'status': false, 'errors': 'CaseStage not found'})
        }
    })
}

exports.filter = async (req, res) => {
    const {search, page,id=''} = req.query

    let params = {}, limit = 25, skip = (page - 1) * limit, total = 0, totalPages = 0
    
    if(id !== '' && ObjectId.isValid(id)){
        params = {case_type:ObjectId(id)}
    }
    
    if(search) {
        params = 
        {   ...params,
            ...{
                $or: [
                    { name: { $regex: search, '$options': 'i' } },
                ]
            }
        }
    }

    let dataCount = await CaseStage.aggregate([
        {$match: {...params}},
        {
            $count: "count"
        }
    ])

    total = dataCount.length && dataCount[0].count

    totalPages = Math.ceil(total/limit)

    await CaseStage.aggregate([
        {$match: {...params}},
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
        { $sort: { createdAt: -1 } },
        {$skip:skip},
        {$limit:limit},

    ]).exec((err,datas)=>{
        err ? res.status(422).json({'status': false, 'errors':errFormatter.formatError(err.message)}):
        res.status(200).json({'status':true, 'datas': datas,'pagination':{total,limit,totalPages}})
    })
}