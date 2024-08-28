const mongoose = require('mongoose')

const folderSchema = new mongoose.Schema({
    created_by: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    name: {
        type: String,
        default:'',
        required: false
    },
    file:{
        type: String,
        default:'',
        required: false
    },
    subFolders:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'folderSchema'
        }
    ]
},{
    timestamps: true
})

module.exports = mongoose.model('folderSchema', folderSchema)