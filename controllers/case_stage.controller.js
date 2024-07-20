const CaseStage = require('../models/caseStage')
const errFormatter = require('../helpers/error.formatter')

exports.get = (req, res)=>{
    CaseStage.find({...req.params.id?{_id: req.params.id}:''}, (err, datas)=>{
        err ? res.status(500).json({'status': false, 'errors': err}):
        res.status(200).json({'status': true, 'datas': (datas)?datas: 'No datas found'})
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