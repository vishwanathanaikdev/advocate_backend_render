const mongoose = require('mongoose')
const validatorHelper = require('../helpers/validator.helper')
const momentTimeZone = require('moment-timezone')

const designationSchema = new mongoose.Schema({
    designation_name: {
        type: String,
        required: [true, 'Designation is required'],
        index: true, 
        unique: true,
        uniqueCaseInsensitive: true,
        trim: true,
        validate: validatorHelper.nameOneValidator
    },
    isActive: {
        type: Boolean,
        default: true,
        trim: true
    }
},{
    timestamps: { currentTime: () => momentTimeZone.tz(Date.now(), "Asia/Kolkata") }
})

designationSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options)=>{
        delete ret._id
        delete ret.__v
        return ret
    }
})

validatorHelper.uniqueValidate(designationSchema)

module.exports = mongoose.model('Designation', designationSchema)