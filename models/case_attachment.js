const mongoose = require('mongoose')

const caseAttachmentSchema = new mongoose.Schema({
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    case:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CaseSchema'
    },
    name: {
        type: String,
        required: [false, 'Name is required'],
        trim: true
    },
    title:{
        type: String,
        default:''
    },
    description:{
        type: String,
        default:''
    },
    sort:{
        type: Number,
        default:0
    },
    type:{
        type: String,
        enum:['attachment','notes'],
        default:'attachment' 
    },
    file:{
        type: String,
        required:false
    }
},{
    timestamps: true
})  

module.exports = mongoose.model('CaseAttachment', caseAttachmentSchema)
