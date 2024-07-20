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
        required: [true, 'Name is required'],
        trim: true
    },
    file:{
        type: String,
        required:true
    }
},{
    timestamps: true
})  

module.exports = mongoose.model('CaseAttachment', caseAttachmentSchema)
