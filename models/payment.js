const mongoose = require('mongoose')

const payment = new mongoose.Schema({
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    bill:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bill',
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
    amountWithGst:{
        type: Number,
        required:true
    },
    amountWithoutGst:{
        type: Number,
        required:true
    },
    description:{
        type: String,
        default:''
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

module.exports = mongoose.model('Payment', payment)
