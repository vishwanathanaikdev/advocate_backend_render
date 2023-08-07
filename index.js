const express = require('express')
const cors = require('cors')
const config = require('./config/config')
const connectDB = require('./config/database')
const bodyParser = require('body-parser')


const role = require('./routes/role.router')
const designation = require('./routes/designation.router')
const department = require('./routes/department.router')
const user = require('./routes/user.router')
const usercalls = require('./routes/user_calls.router')
const landallocate = require('./routes/land_allocate.router')
const homeData = require('./routes/home_data.router')



const app = express()

app.use(cors())
connectDB(config.db_url)


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

app.use('/api/role', role)
app.use('/api/designation', designation)
app.use('/api/department', department)
app.use('/api/user', user)
app.use('/api/land_allocate', landallocate)
app.use('/api/user_calls', usercalls)
app.use('/api/home_data', homeData)




app.use((req, res, next) => {
    res.status(404).json({ 'status': false, 'errors': 'Requested url not found' })
})

// require('./crons')



app.listen(config.port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${config.port}`)
})