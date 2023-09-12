const mongoose = require('mongoose')

const landAllocateSchema = new mongoose.Schema({
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
    site_no: {
        type: String,
        trim: true,
        unique: true
    },
    site_info:{
        type: String,
    },
    muda_docs:{
        type: String,
    },
    stage:{
        type: String,
    },
    village:{
        type: String,
    },
    survey_no:{
        type: String,
    },
    category:{
        type: String,
    },
    extent:{
        type: String,
    },
    katha:{
        type: Boolean,
        default:false
    },
    registration_date:{
        type: Date,
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
    sales_deed:{
        type: String,
    },
    noc:{
        type:String
    },
    voter_id:{
        type:String
    },
    ration_card:{
        type:String
    },
    purchased_from:{
        type:String
    },
    date_of_contact:{
        type:String
    },
    live_status:{
        type:Boolean,
        default:false
    },
    document_lost_phase:{
        type:String
    },
    death_certificate:{
        type:String
    },
    family_tree:{
        type:String
    },
    andiment:{
        type:String
    }
},{
    timestamps: true
})

module.exports = mongoose.model('LandAllocate', landAllocateSchema)