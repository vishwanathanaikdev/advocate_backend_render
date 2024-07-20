const mongoose = require('mongoose')

const caseStageSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    
},{
    timestamps:true
})




module.exports = mongoose.model('CaseStage', caseStageSchema)