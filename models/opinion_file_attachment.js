const mongoose = require('mongoose')

const opinionFileAttachmentSchema = new mongoose.Schema({
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    opinion_file:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'OpinionFileSchema'
    },
    name: {
        type: String,
        trim: true,
        required:false
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

module.exports = mongoose.model('OpinionFileAttachment', opinionFileAttachmentSchema)
