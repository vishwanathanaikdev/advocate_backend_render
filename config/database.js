const mongoose = require('mongoose');
const logs = require('../helpers/logger.helper').Logger;

const connection = async (dbUrl) => {
  if (!dbUrl) {
    console.error('❌ No DB URL provided.');
    return;
  }

  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Database connected successfully');
    logs.info('Database connected successfully');

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Retrying...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB connection closed due to app termination');
      process.exit(0);
    });
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    logs.error(`Database Connection Error: ${err.stack}`);
  }
};

module.exports = connection;











//------>>> old


// const mongoose = require('mongoose')
// const logs = require('../helpers/logger.helper').Logger

// const connection = async(dbUrl) => {
//     if(dbUrl !== undefined) {
//         try {
//             await mongoose.connect(dbUrl)
//              console.log('Database connected');		
//         }
//         catch(err) {
//             console.log('error');		
//             logs.error(`Database Connection:- ${err}`)
//         }
//     }
// }


// module.exports = connection
