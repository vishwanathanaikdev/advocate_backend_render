const mongoose = require('mongoose')
const logs = require('../helpers/logger.helper').Logger

const connection = async(dbUrl) => {
    if(dbUrl !== undefined) {
        try {
            await mongoose.connect(dbUrl)
             console.log('Database connected');		
        }
        catch(err) {
            console.log('error');		
            logs.error(`Database Connection:- ${err}`)
        }
    }
}


module.exports = connection
