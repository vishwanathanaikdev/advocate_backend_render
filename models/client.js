const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
    },
    company_name:{
        type: String,
    },
    address: {
        type: String,
    },
    aadhar_no:{
        type: String,
    },
    pan_no:{
        type: String,
    },
    photo:{
        type: String,
    },
    aadhar_file:{
        type: String,
    },
    pan_file:{
        type: String,
    },
    dl_file:{
        type: String,
    },
    client_type:{
        type: String,
        enum:['person','company']
    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    secondary_name:{
        type: String,
    },
    secondary_contact:{
        type: String,
    },
    comments:{
        type: String,
    },
    is_active:{
        type: Boolean,
        default:false
    }
},{
    timestamps: true
})

module.exports = mongoose.model('ClientSchema', clientSchema)