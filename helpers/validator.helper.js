const validate = require('mongoose-validator')
const uniqueValidator = require('mongoose-unique-validator')
const momentTimeZone = require('moment-timezone')

exports.nameValidator = [
    validate({
        validator: 'matches',
        arguments: /(^([a-zA-Z\s]+)(\d+)?$)/u,
        message: 'Name format is invalid'
    }),
]

exports.nameOneValidator = [
    validate({
        validator: 'matches',
        arguments: /(^([a-zA-Z\s&_.-/]+)(\d+)?$)/u,
        message: 'Name format is invalid'
      })
]

/* exports.phoneValidate = [
    validate({
        validator: (v)=>{
            if(v) {
                if(!v.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/) || !v.match(/^(|[1-9]\d*)$/)) return false
                return v
            }
        },
        message: 'Invalid Phone'
    })
] */
// if(!v.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/) || !v.match(/^(|[1-9]\d*)$/))

exports.phoneValidate = (v) => {
    if(!v.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im) || v.match(/^0*$/)) return false
    return v
}

exports.companyPhoneValidate = [
    validate({
        validator: (v)=>{
            if(v) {
                if(!v.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im) || v.match(/^0*$/)) return false
                return v
            }
        },
        message: 'Invalid Phone'
    })
]

/* exports.emailValidate = [
    validate({
        validator: (v)=>{
            if(v) {
                if(!v.match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) return false
                return v
            }
        },
        message: 'Invalid Email'
    })
]
 */

exports.emailValidate = (v) => {
    if(v) {
        if(!v.match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) return false
        return v
    }
}


exports.companyEmailValidate = [
    validate({
        validator: (v)=>{
            if(v) {
                if(!v.match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) return false
                return v
            }
        },
        message: 'Invalid Email'
    })
]

exports.websiteValidate = [
    validate({
        validator: (v)=>{
            if(v) {
              if(!v.match(/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/)) return false
              return v
            }
        },
        message: 'Invalid Website URL'
    }),
]

exports.pinCodeValidate = [
    validate({
        validator: (v)=>{
            if(v) {
              if(!v.match(/^[0-9]*$/)) return false
              return v
            }
        },
        message: 'Invalid Pin Code'
    }),
    
]

exports.typeValidate = [
    validate({
        validator: (v)=>{
            let accept = ['Lead', 'Contact', 'Task', 'Meeting', 'Deal']
            if(!accept.includes(v)) return false
            return v
        },
        message: 'allowed only Lead or Contact or Task or Meeting or Deal'
    })
]

exports.permissionValidator = [
    validate({
        validator: 'matches',
        arguments: /(^([a-zA-Z\s_]+)(\d+)?$)/u,
        message: 'Name format is invalid'
      })
]

exports.dateLess = [
    validate({
        validator: (v)=>{
            if(momentTimeZone.tz(v, "Asia/Kolkata")<momentTimeZone.tz(Date.now(), "Asia/Kolkata")) return false
            return v
        },
        message: 'Date should be greater than or equal to today'
    })
]

exports.uniqueValidate = (schema)=>{
    return schema.plugin(uniqueValidator, { message: 'Expected {PATH} to be unique.' })
}