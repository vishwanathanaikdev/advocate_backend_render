const express = require('express')
const cors = require('cors')
const config = require('./config/config')
const connectDB = require('./config/database')
const bodyParser = require('body-parser')


const role = require('./routes/role.router')
const client = require('./routes/client.router')
const casetype = require('./routes/casetype.router')
const caseStage = require('./routes/casestage.router')
const designation = require('./routes/designation.router')
const user = require('./routes/user.router')
const caseroute = require('./routes/case.router')
const homeData = require('./routes/home_data.router')
const land_allocate_attachment = require('./routes/case_attachment.router')


const app = express()

app.use(cors())
connectDB(config.db_url)


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

app.use('/api/role', role)
app.use('/api/client', client)
app.use('/api/case_type', casetype)
app.use('/api/case_stage', caseStage)
app.use('/api/designation', designation)
app.use('/api/user', user)
app.use('/api/case', caseroute)
app.use('/api/land_allocate_attachment', land_allocate_attachment)
app.use('/api/home_data', homeData)




app.use((req, res, next) => {
    res.status(404).json({ 'status': false, 'errors': 'Requested url not found' })
})

// require('./crons')



app.listen(config.port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${config.port}`)
})