const Role = require('../models/role')
const errFormatter = require('../helpers/error.formatter')

exports.get = (req, res)=>{
    Role.find({...req.params.id?{_id: req.params.id}:''}, (err, datas)=>{
        err ? res.status(500).json({'status': false, 'errors': err}):
        res.status(200).json({'status': true, 'datas': (datas)?datas: 'No datas found'})
    })
}

exports.create = (req, res)=>{
    Role.create(req.body, (err, data)=>{
        err ? res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)}):
        res.status(201).json({'status':true, 'datas': data})
    })
}

exports.update = (req, res)=>{
    Role.findOne({_id: req.params.id}, (err, data)=>{
        if(err) res.status(500).json({'status': false, 'errors': err})
        if(data) {
            Role.findOneAndUpdate({_id: req.params.id}, req.body, { runValidators: true, context: 'query', new: true }, (err, data)=>{
                err ? res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)}):
                res.status(200).json({'status': true, 'datas': data})
            })
        }
        else {
            res.status(404).json({'status': false, 'errors': 'Role not found'})
        }
    })
}

exports.delete =async (req, res)=>{
   return await Role.findOne({_id: req.params.id}, (err, data)=>{
        if(err) res.status(500).json({'status': false, 'errors': err})
        if(data) {
            Role.deleteOne({_id: req.params.id}, (err, data)=>{
                err ? res.status(500).json({'status': false, 'errors': err}):
                res.status(200).json({'status': true, 'datas': data})
            })
        }
        else {
            res.status(404).json({'status': false, 'errors': 'Role not found'})
        }
    }).clone()
}
