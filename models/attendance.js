const mongoose = require('mongoose')


const attendanceSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    log_in_location:{
        type:String
    },
    log_in:{
        type:String
    },
    log_out:{
        type:String
    },
    log_out_location:{
        type:String
    },
    date:{
        type:Date
    }
},{
    timestamps:true
})    

module.exports = mongoose.model('AttendanceSchema', attendanceSchema)
