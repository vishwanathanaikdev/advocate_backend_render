const CaseType = require('../models/caseType')
const errFormatter = require('../helpers/error.formatter')

exports.get = async(req, res)=>{
    const {page=1} = req.query

    let params = {}, limit = 25, skip = (page - 1) * limit, total = 0, totalPages = 0

    total = await CaseType.find(params).count()

    totalPages = Math.ceil(total/limit)

    await CaseType.aggregate([
        {$match: {...params}},
        {$sort: { createdAt: -1 }},
        {$skip:skip},
        {$limit:limit},

    ]).exec((err,datas)=>{
        err ? res.status(422).json({'status': false, 'errors':errFormatter.formatError(err.message)}):
        res.status(200).json({'status':true, 'datas': datas,'pagination':{total,limit,totalPages}})
    })
}

exports.create = (req, res)=>{
    CaseType.create(req.body, (err, data)=>{
        err ? res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)}):
        res.status(201).json({'status': true, 'datas': data})
    })
}

exports.update = (req, res)=> {
    let casetypeData = Object.assign({}, req.body)
    CaseType.findOne({_id: req.params.id}, (err, data)=>{
        if(err) res.status(500).json({'status': false, 'errors': err})
        if(data) {
            CaseType.findOneAndUpdate({_id: req.params.id}, casetypeData, { runValidators: true, context: 'query', new: true }, (err, data)=>{
                err ? res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)}):
                res.status(200).json({'status': true, 'datas': data})
            })
        }
        else {
            res.status(404).json({'status': false, 'errors': 'CaseType not found'})
        }
    })
}

exports.delete = (req, res)=> {
    return CaseType.findOne({_id: req.params.id}, (err, data)=>{
        if(err) return res.status(500).json({'status': false, 'errors': err})
        if(data) {
            CaseType.deleteOne({_id: req.params.id}, (err, data)=>{
                err ? res.status(500).json({'status': false, 'errors': err}):
                res.status(200).json({'status': true, 'datas': 'CaseType successfully'})
            })
        }
        else {
            res.status(404).json({'status': false, 'errors': 'CaseType not found'})
        }
    })
}

exports.filter = async (req, res) => {
    const {search, page=1} = req.query

    let params = {}, limit = 25, skip = (page - 1) * limit, total = 0, totalPages = 0
    if(search) {
        params = {
            $or: [
                { name: { $regex: search, '$options': 'i' } },
            ]
        }
    }

    let dataCount = await CaseType.aggregate([
        {$match: {...params}},
        {
            $count: "count"
        }
    ])

    total = dataCount.length && dataCount[0].count

    totalPages = Math.ceil(total/limit)

    await CaseType.aggregate([
        {$match: {...params}},
        { $sort: { createdAt: -1 } },
        {$skip:skip},
        {$limit:limit},

    ]).exec((err,datas)=>{
        err ? res.status(422).json({'status': false, 'errors':errFormatter.formatError(err.message)}):
        res.status(200).json({'status':true, 'datas': datas,'pagination':{total,limit,totalPages}})
    })
}