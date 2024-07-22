const mongoose = require('mongoose')


const ReminderSchema = new mongoose.Schema({
    created_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    title: {
        type: String,
        required: true,
        trim: true
    },
    description :{
        type: String,
        default: null,
        trim: true
    },
    on_date_time: {
        type: Date,
        default: null,
        trim: true
    },
    type:{
        type: String,
        enum:['case','opinion_file'],
        default:'case' 
    },
    isActive:{
        type: Boolean,
        default:true
    },
}, {
    timestamps: true
});





module.exports = mongoose.model('ReminderSchema', ReminderSchema)