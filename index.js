const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const connectDB = require('./config/database');
const bodyParser = require('body-parser');

// Import Routes
const role = require('./routes/role.router');
const client = require('./routes/client.router');
const casetype = require('./routes/casetype.router');
const reminder = require('./routes/reminder.router');
const caseStage = require('./routes/casestage.router');
const designation = require('./routes/designation.router');
const user = require('./routes/user.router');
const opinionfileroute = require('./routes/opinion_file.router');
const caseroute = require('./routes/case.router');
const homeData = require('./routes/home_data.router');
const activity = require('./routes/activity.router');
const opinion_file_attachment = require('./routes/opinion_file_attachment.router');
const case_attachment = require('./routes/case_attachment.router');
const bills = require('./routes/bills.router');
const payment = require('./routes/payment.router');
const folder_router = require('./routes/folder.schema.router');
const folder_activity_router = require('./routes/folder.activity.schema.router');
const driveCredentials = require('./routes/driveCredential.routes');

const app = express();

// ✅ CORS Configuration
app.use(cors({
  origin: [
    config.app_url,
    process.env.UI_URL
  ],
  credentials: true,
}));

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// ✅ Database Connection + Crons
connectDB(config.db_url).then(() => {
  console.log('✅ Database connected.');
  require('./crons');
});

// ✅ API Routes
app.use('/api/role', role);
app.use('/api/client', client);
app.use('/api/case_type', casetype);
app.use('/api/case_stage', caseStage);
app.use('/api/designation', designation);
app.use('/api/user', user);
app.use('/api/case', caseroute);
app.use('/api/reminder', reminder);
app.use('/api/bills', bills);
app.use('/api/payment', payment);
app.use('/api/opinion_file', opinionfileroute);
app.use('/api/opinion_file_attachment', opinion_file_attachment);
app.use('/api/case_attachment', case_attachment);
app.use('/api/home_data', homeData);
app.use('/api/activity', activity);
app.use('/api/folder', folder_router);
app.use('/api/folder_activity', folder_activity_router);
app.use('/api/drive-credentials', driveCredentials);

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ status: false, message: 'Requested URL not found' });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// ✅ Start Server
const PORT = process.env.PORT || config.port || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});














///========================>> Old one 


// const express = require('express')
// const cors = require('cors')
// const config = require('./config/config')
// const connectDB = require('./config/database')
// const bodyParser = require('body-parser')


// const role = require('./routes/role.router')
// const client = require('./routes/client.router')
// const casetype = require('./routes/casetype.router')
// const reminder = require('./routes/reminder.router')
// const caseStage = require('./routes/casestage.router')
// const designation = require('./routes/designation.router')
// const user = require('./routes/user.router')
// const opinionfileroute = require('./routes/opinion_file.router')
// const caseroute = require('./routes/case.router')
// const homeData = require('./routes/home_data.router')
// const activity = require('./routes/activity.router')
// const opinion_file_attachment = require('./routes/opinion_file_attachment.router')
// const case_attachment = require('./routes/case_attachment.router')
// const bills = require('./routes/bills.router')
// const payment = require('./routes/payment.router')
// const folder_router = require('./routes/folder.schema.router')
// const folder_activity_router = require('./routes/folder.activity.schema.router')
// const driveCredentials = require('./routes/driveCredential.routes')


// const app = express()

// app.use(cors())
// connectDB(config.db_url)


// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// app.use(express.static(__dirname + '/public'))

// app.use('/api/role', role)
// app.use('/api/client', client)
// app.use('/api/case_type', casetype)
// app.use('/api/case_stage', caseStage)
// app.use('/api/designation', designation)
// app.use('/api/user', user)
// app.use('/api/case', caseroute)
// app.use('/api/reminder', reminder)
// app.use('/api/bills', bills)
// app.use('/api/payment', payment)
// app.use('/api/opinion_file', opinionfileroute)
// app.use('/api/opinion_file_attachment', opinion_file_attachment)
// app.use('/api/case_attachment', case_attachment)
// app.use('/api/home_data', homeData)
// app.use('/api/activity', activity)
// app.use('/api/folder',folder_router)
// app.use('/api/folder_activity',folder_activity_router)
// app.use('/api/drive-credentials', driveCredentials)



// app.use((req, res, next) => {
//     res.status(404).json({ 'status': false, 'errors': 'Requested url not found' })
// })

// require('./crons')



// app.listen(config.port, '0.0.0.0', () => {
//     console.log(`Server running on http://localhost:${config.port}`)
// })









//=====>> Old one




// const express = require('express')
// const cors = require('cors')
// const config = require('./config/config')
// const connectDB = require('./config/database')
// const bodyParser = require('body-parser')


// const role = require('./routes/role.router')
// const client = require('./routes/client.router')
// const casetype = require('./routes/casetype.router')
// const reminder = require('./routes/reminder.router')
// const caseStage = require('./routes/casestage.router')
// const designation = require('./routes/designation.router')
// const user = require('./routes/user.router')
// const opinionfileroute = require('./routes/opinion_file.router')
// const caseroute = require('./routes/case.router')
// const homeData = require('./routes/home_data.router')
// const activity = require('./routes/activity.router')
// const opinion_file_attachment = require('./routes/opinion_file_attachment.router')
// const case_attachment = require('./routes/case_attachment.router')
// const bills = require('./routes/bills.router')
// const payment = require('./routes/payment.router')
// const folder_router = require('./routes/folder.schema.router')
// const folder_activity_router = require('./routes/folder.activity.schema.router')

// const app = express()

// app.use(cors())
// connectDB(config.db_url)


// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// app.use(express.static(__dirname + '/public'))

// app.use('/api/role', role)
// app.use('/api/client', client)
// app.use('/api/case_type', casetype)
// app.use('/api/case_stage', caseStage)
// app.use('/api/designation', designation)
// app.use('/api/user', user)
// app.use('/api/case', caseroute)
// app.use('/api/reminder', reminder)
// app.use('/api/bills', bills)
// app.use('/api/payment', payment)
// app.use('/api/opinion_file', opinionfileroute)
// app.use('/api/opinion_file_attachment', opinion_file_attachment)
// app.use('/api/case_attachment', case_attachment)
// app.use('/api/home_data', homeData)
// app.use('/api/activity', activity)
// app.use('/api/folder',folder_router)
// app.use('/api/folder_activity',folder_activity_router)


// app.use((req, res, next) => {
//     res.status(404).json({ 'status': false, 'errors': 'Requested url not found' })
// })

// require('./crons')



// app.listen(config.port, '0.0.0.0', () => {
//     console.log(`Server running on http://localhost:${config.port}`)
// })
