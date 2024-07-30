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
    stage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CaseStage',
        required:false
    },
    attachment:{
        type: String,
        default:'',
        required:false
    },
    remarks:{
        type: String,
        default:''
    },
    next_hearing_date:{
        type: Date,
        required:false
    },
    type:{
        type: String,
        enum:['case','opinion_file'],
        default:'case' 
    },
    important:{
        type:Boolean,
        default:false
    }, 
    summary:{
        type: String,
        default:''
    },
},{
    timestamps: true
})  

module.exports = mongoose.model('Activity', activity)
