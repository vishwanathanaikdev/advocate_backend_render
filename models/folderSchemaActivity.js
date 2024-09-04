const mongoose = require('mongoose')

const folderActivitySchema = new mongoose.Schema({
    created_by: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    driveItem:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'folderSchema',
        required:false
    },
},{
    timestamps: true
})

module.exports = mongoose.model('folderActivitySchema', folderActivitySchema)