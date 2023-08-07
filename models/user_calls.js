const mongoose = require('mongoose')
const validatorHelper = require('../helpers/validator.helper')

const usercallsSchema = new mongoose.Schema({
    name: {
        type: String,
        require:true
    },
    type:{
        type: String,
        require:true
    },
    phone: {
        type: String,
        require:true
    },
    comments:{
        type: String,
    },
    created_by:{
        type: mongoose.Schema.Types.ObjectId, 
        ref:'User'
    }
},{
    timestamps:true
})


module.exports = mongoose.model('UserCalls', usercallsSchema)