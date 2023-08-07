const Department = require('../models/department')
const errFormatter = require('../helpers/error.formatter')

exports.get = (req, res) => {
    Department.find({...req.params.id?{_id: req.params.id}:''}, (err, datas)=>{
        err ? res.status(500).json({'status': false, 'errors': err}):
        res.status(200).json({'status': true, 'datas': (datas)?datas: 'No datas found'})
    })
}

exports.create = (req, res)=>{
    Department.create(req.body, (err, data)=>{
        err ? res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)}):
        res.status(201).json({'status': true, 'datas': data})
    })
}

exports.update = (req, res)=> {
    let departmentData = Object.assign({}, req.body)
    delete departmentData.isActive
    delete departmentData.user
    departmentData.isActive = req.body.isActive
    Department.findOne({_id: req.params.id}, (err, data)=>{
        if(err) return res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)})
        if(data) {
            Department.findOneAndUpdate({_id: req.params.id}, departmentData, { runValidators: true, context: 'query', new: true }, (err, data)=>{
                if(err) return res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)})
                res.status(200).json({'status': true, 'datas': data})
            })
        }
        else {
            res.status(404).json({'status': false, 'errors': 'Department not found'})
        }
    })
}

exports.delete = (req, res)=> {
    Department.findOne({_id: req.params.id}, (err, data)=>{
        if(err) return res.status(500).json({'status': false, 'errors': err})
        if(data) {
            Department.deleteOne({_id: req.params.id}, (err, data)=>{
                if(err) return res.status(500).json({'status': false, 'errors': err})
                res.status(200).json({'status': false, 'datas': 'Deleted successfully'})
            })
        }
        else {
            res.status(404).json({'status': false, 'errors': 'Department not found'})
        }
    })
}