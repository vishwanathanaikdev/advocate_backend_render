const mongoose = require('mongoose')
const validatorHelper = require('../helpers/validator.helper')


const roleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        required: true,
        index: true, 
        unique: true,
        uniqueCaseInsensitive: true,
        validate: validatorHelper.permissionValidator,
        trim: true
    },
    display_name: {
        type: String,
        require: true,
        validate: validatorHelper.nameValidator,
        trim: true
    },
    description: {
        type: String,
        max: 12,
        default: null,
        trim: true
    }
},{
    timestamps: true
})

roleSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options)=>{
        delete ret._id
        delete ret.__v
        return ret
    }
})

validatorHelper.uniqueValidate(roleSchema)

module.exports = mongoose.model('Role', roleSchema)