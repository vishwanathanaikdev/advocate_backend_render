const jwt = require('jsonwebtoken')
const UserAccessToken = require('../models/user_access_token')

exports.createToken = (payload, expire = 0)=> {
    return jwt.sign(payload, process.env.APP_KEY, {...(expire !== 0)?{expiresIn: expire}:''})
}

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && req.headers.authorization.split(' ')[1]
    if(token == null) return res.status(401).json({'status': false, 'errors': 'Unauthorized'})

    jwt.verify(token, process.env.APP_KEY, (err, decoded)=>{

        if(err) {
            return res.status(401).json({'status': false, 'errors': 'Unauthorized'})
        }
        else{
            UserAccessToken.findOne({$and: [{user_id: decoded.id}, {access_token: token}]}, (err, data)=>{
                if(err) res.status(500).json({'status': false, 'errors': err})
                if(data) {

                    if(data.access_token === token) {
                        let user_Data = {...decoded}
                        delete user_Data.phone
                        delete user_Data.email
                        delete user_Data.image
                        delete user_Data.official_email
                        delete user_Data.official_phone
                        delete user_Data.is_verified
                        delete user_Data.app_access
                        delete user_Data.is_active
                        delete user_Data.designation_id
                        delete user_Data.dob
                        delete user_Data.doj
                        req.body.user = user_Data

                        next()
                    }
                    else {
                        return res.status(401).json({'status': false, 'errors': 'Unauthorized'})
                    }
                }
                else {
                    return res.status(401).json({'status': false, 'errors': 'Unauthorized'})
                }
                
            })
        }
    })
}

exports.verifyVerificationToken = (token) => {
    try {
        return jwt.verify(token, process.env.APP_KEY)
    }
    catch(err) {
        return err
    }
}