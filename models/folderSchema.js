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
    subFolders:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'folderSchema',
            required:false
    },
    type:{
        type: String,
        enum:['img','xlsx','pdf','folder','zip','video','docs','']
    },
    important:{
        type:Boolean,
        default:false
    },
    deleted:{
        type:Boolean,
        default:false
    },
    deleted_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    fileSize:{
        type: String,
        default:''
    },
},{
    timestamps: true
})

module.exports = mongoose.model('folderSchema', folderSchema)