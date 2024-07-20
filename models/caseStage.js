const mongoose = require('mongoose')

const caseStageSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    case_type:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CaseType'
    }
    
},{
    timestamps:true
})




module.exports = mongoose.model('CaseStage', caseStageSchema)