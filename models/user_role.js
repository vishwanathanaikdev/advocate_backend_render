const mongoose = require('mongoose')

const userRoleSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: true
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        trim: true
    }
}, {
    timestamps: true
})

userRoleSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret._id
        delete ret.__v
        return ret
    }
})

module.exports = mongoose.model('UserRole', userRoleSchema, 'user_roles')