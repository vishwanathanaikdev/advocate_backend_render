const mongoose = require('mongoose')

const landAllocateAttachmentSchema = new mongoose.Schema({
    land_allocated:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'LandAllocate'
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

module.exports = mongoose.model('LandAllocateAttachment', landAllocateAttachmentSchema)
