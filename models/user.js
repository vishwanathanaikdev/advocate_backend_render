const mongoose = require('mongoose')
const validatorHelper = require('../helpers/validator.helper')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        validate: validatorHelper.nameValidator,
        trim: true
    },
    employee_id: {
        type: String,
        sparse: true, 
        unique: true,
        uniqueCaseInsensitive: true,
        max: 12,
        lowercase: true,
        trim: true
    },
   
    designation_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Designation',
        trim: true
    },
    department_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Department',
        trim: true
    },
    official_phone: {
        type: String,
        validate: validatorHelper.companyPhoneValidate,
        trim: true
    },
    official_email: {
        type: String,
        index:true,
        sparse: true, 
        unique: true,
        lowercase: true,
        validate: validatorHelper.companyEmailValidate,
        trim: true
    },
    dob: {
        type: String,
        default: null,
        trim: true
    },
    doj: {
        type: String,
        default: null,
        trim: true
    },
    doe: {
        type: String,
        default: null,
        trim: true,
        required:false
    },
    email:{
        type: String,
        validate: validatorHelper.emailValidate,
        trim: true,
        unique:true
    },
    phone:{
        type: String,
        validate: validatorHelper.phoneValidate,
        trim: true,
        unique:true
    },
    password: {
        type: String,
        trim: true
    },
    profile_photo: {
        type: String,
        default: null,
        trim: true
    },
    is_active: {
        type: Boolean,
        default: false,
        trim: true
    },
    is_verified:{
        type: Boolean,
        default:false
    },
    app_access:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String, 
    },
    bio:{
        type:String,
    }
},{
    timestamps: true
})

userSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret, options) {
        delete ret._id
        delete ret.__v
        delete ret.password
        delete ret.token
        return ret;
    }
});

validatorHelper.uniqueValidate(userSchema)

module.exports = mongoose.model('User', userSchema)