const CaseType = require('../models/caseType')
const errFormatter = require('../helpers/error.formatter')

exports.get = (req, res)=>{
    CaseType.find({...req.params.id?{_id: req.params.id}:''}, (err, datas)=>{
        err ? res.status(500).json({'status': false, 'errors': err}):
        res.status(200).json({'status': true, 'datas': (datas)?datas: 'No datas found'})
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