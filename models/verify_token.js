const mongoose = require('mongoose')

const verifyTokenSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    type_id: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('VerifyTokenSchema', verifyTokenSchema, 'verify_tokens')