const fs = require('fs')
const path = require('path')
const Logger = (exports.Logger = {})

const readFile = (file, cb) => {
  fs.readFile(file, (err, contents)=>{
    if(err) {
      cb([])
    }
    else {
      cb(contents.toString())
    }
  })
}

Logger.info = (msg) => {
  const message = new Date().toISOString() + " : " + msg + "\n"
  let p = path.join(__dirname, '../logs', 'info.txt')
  readFile(p,(contents)=>{
    contents += message
    fs.writeFileSync(p, contents)
  })
}

Logger.debug = (msg) => {
  const message = new Date().toISOString() + " : " + msg + "\n"
  let p = path.join(__dirname, '../logs', 'debug.txt')
  readFile(p,(contents)=>{
    contents += message
    fs.writeFileSync(p, contents)
  })
}

Logger.error = (msg) => {
  const message = new Date().toISOString() + " : " + msg + "\n"
  let p = path.join(__dirname, '../logs', 'error.txt')
  readFile(p,(contents)=>{
    contents += message
    fs.writeFileSync(p, contents)
  })
}

Logger.clear = ()=>{
  return (fs.createWriteStream("logs/info.txt") && fs.createWriteStream("logs/debug.txt") && fs.createWriteStream("logs/error.txt"))?
  true:false
}