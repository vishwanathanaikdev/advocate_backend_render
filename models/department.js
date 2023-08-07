const mongoose = require('mongoose')
const validatorHelper = require('../helpers/validator.helper')
const momentTimeZone = require('moment-timezone')

const departmentSchema = new mongoose.Schema({
    department_name: {
        type: String,
        required: true,
        index: true, 
        unique: true,
        uniqueCaseInsensitive: true,
        trim: true,
        validate: validatorHelper.nameValidator
    },
    isActive: {
        type: Boolean,
        default: true,
        trim: true
    }
},{
    timestamps: { currentTime: () => momentTimeZone.tz(Date.now(), "Asia/Kolkata") }
})

departmentSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options)=>{
        delete ret._id
        delete ret.__v
        return ret
    }
})


validatorHelper.uniqueValidate(departmentSchema)

module.exports = mongoose.model('Department', departmentSchema)