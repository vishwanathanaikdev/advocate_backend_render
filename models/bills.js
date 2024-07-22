const mongoose = require('mongoose')

const bill = new mongoose.Schema({
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    case:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CaseSchema',
        required:false
    },
    opinion_file:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'OpinionFileSchema',
        required:false
    },
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ClientSchema',
        required:false
    },
    bill_id:{
        type: String,
        required:true
    },
    bill_info:{
        type: String,
        default:''
    },
    file:{
        type: String,
        required:true
    },
    amountWithGst:{
        type: Number,
        required:true
    },
    amountWithoutGst:{
        type: Number,
        required:true
    },
    completedPaymentRecieved:{
        type: Boolean,
        default:false
    },
    date:{
        type: Date,
        required:true
    },
    type:{
        type: String,
        enum:['case','opinion_file'],
        default:'case' 
    },
},{
    timestamps: true
})  

module.exports = mongoose.model('Bill', bill)
