const mongoose = require('mongoose')

const caseSchema = new mongoose.Schema({
    created_by: {
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
    case_no:{
        type:String,
        default:''
    },
    parties_name:{
        type:String,
        default:''
    },
    advocate_for:{
        type:String,
        default:''
    },
    court_hall:{
        type:String,
        default:''
    },
    floor:{
        type:String,
        default:''
    },
    file:{
        type:String,
        default:''
    },
    case_details:{
        type:String,
        default:''
    },
    stage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CaseStage'
    },
    case_type:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CaseType'
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
    next_hearing_date:{
        type:Date,
        required:false
    },
    previous_hearing_date:{
        type:Date,
        required:false
    },
},{
    timestamps: true
})

module.exports = mongoose.model('CaseSchema', caseSchema)