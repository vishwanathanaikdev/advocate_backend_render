const mongoose = require('mongoose')

const opinionFileSchema = new mongoose.Schema({
    created_by: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    allocation_of_work:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    client: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'ClientSchema'
    },
    office_file_no:{
        type:String,
        default:''
    },
    property_details:{
        type:String,
        default:''
    },
    work_details:{
        type:String,
        default:''
    },
    file:{
        type:String,
        default:''
    },
    comments:{
        type:String,
        default:''
    },
    status:{
        type:String,
        enum:['Pending','In Progress','Completed','Hold'],
        default:'Pending'
    },
},{
    timestamps: true
})

module.exports = mongoose.model('OpinionFileSchema', opinionFileSchema)