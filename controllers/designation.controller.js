const Designation = require('../models/designation')
const errFormatter = require('../helpers/error.formatter')

exports.get = (req, res)=>{
    Designation.find({...req.params.id?{_id: req.params.id}:''}, (err, datas)=>{
        err ? res.status(500).json({'status': false, 'errors': err}):
        res.status(200).json({'status': true, 'datas': (datas)?datas: 'No datas found'})
    })
}

exports.create = (req, res)=>{
    Designation.create(req.body, (err, data)=>{
        err ? res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)}):
        res.status(201).json({'status': true, 'datas': data})
    })
}

exports.update = (req, res)=> {
    let designationData = Object.assign({}, req.body)
    designationData.isActive = req.body.isActive
    Designation.findOne({_id: req.params.id}, (err, data)=>{
        if(err) res.status(500).json({'status': false, 'errors': err})
        if(data) {
            Designation.findOneAndUpdate({_id: req.params.id}, designationData, { runValidators: true, context: 'query', new: true }, (err, data)=>{
                err ? res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)}):
                res.status(200).json({'status': true, 'datas': data})
            })
        }
        else {
            res.status(404).json({'status': false, 'errors': 'Designation not found'})
        }
    })
}

exports.delete = (req, res)=> {
    console.log('req.params.id',req.params.id)
    return Designation.findOne({_id: req.params.id}, (err, data)=>{
        if(err) return res.status(500).json({'status': false, 'errors': err})
        if(data) {
            Designation.deleteOne({_id: req.params.id}, (err, data)=>{
                err ? res.status(500).json({'status': false, 'errors': err}):
                res.status(200).json({'status': true, 'datas': 'Deleted successfully'})
            })
        }
        else {
            res.status(404).json({'status': false, 'errors': 'Designation not found'})
        }
    })
}