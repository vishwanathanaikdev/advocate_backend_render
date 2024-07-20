const mongoose = require('mongoose')

const caseTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    
},{
    timestamps:true
})




module.exports = mongoose.model('CaseType', caseTypeSchema)