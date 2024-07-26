const mongoose = require('mongoose')

const activity = new mongoose.Schema({
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
    description:{
        type: String,
        default:''
    },
    attachment:{
        type: String,
        default:''
    },
    remarks:{
        type: String,
        default:''
    },
    next_hearing_date:{
        type: Date,
        required:true
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

module.exports = mongoose.model('Activity', activity)
