exports.formatError = (e) => {
    let errors = {}
    allErrors = e.substring(e.indexOf(':')+1).split(',').map((e)=>e.trim())
    allErrors.forEach(error=>{
        const [key, value] = error.split(':')
        if(key && value) {
            errors[key] = value.trim()
        }
        else {
            errors = error
        }
    })
    return errors
}