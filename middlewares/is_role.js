exports.isRole = (roles)=>{
    return (req, res, next) => {
        let access = false
        roles.forEach(role => {
            if(req.body.user.roles.includes(role)) {
                access = true
            }
        })
        if(access) {
            next()
        }
        else {
            return res.status(403).json({'status': false, 'errors': 'Access Forbidden'})
        }
    }
}