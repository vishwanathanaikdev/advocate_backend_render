const mongoose = require('mongoose')

const userAccessTokenSchema = new mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: true 
    },
    access_token: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

userAccessTokenSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options)=>{
        delete ret._id
        delete ret.__v
        return ret
    }
})

module.exports = mongoose.model('UserAccessToken', userAccessTokenSchema, 'user_access_tokens')