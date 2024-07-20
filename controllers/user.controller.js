const bcrypt = require('bcrypt')
const fs = require('fs')
const User = require('../models/user')
// const Department = require('../models/department')
const UserAccessToken = require('../models/user_access_token')
const UserRole = require('../models/user_role')
const VerifyToken = require('../models/verify_token')
const jwt = require('../middlewares/jwt')
const mail = require('../helpers/email.helper')
const errFormatter = require('../helpers/error.formatter')
const user = require('../models/user')
const ObjectId = require('mongoose').Types.ObjectId

const saltRounds = 10, salt = bcrypt.genSaltSync(saltRounds)


const saveRoles = (roles) => {
    roles.forEach(async item=>{
        let roleExist = await UserRole.findOne({$and:[{user_id: item.user_id}, {role_id: item.role_id}]})
        if(!roleExist) {
            await UserRole.create(item)
        }
    })
}

exports.get = async (req, res) => {
    let params = {}, skip = 0, total = await User.find().count(), limit = 25, totalPages = 1
    if (req.params.id) {
        if (ObjectId.isValid(req.params.id)) {
            params = {
                _id: ObjectId(req.params.id),
            }
        } else {
            if (!isNaN(parseInt(req.params.id))) {
                skip = (parseInt(req.params.id) - 1) * limit
                totalPages = Math.ceil(total / limit)
                params = {}  
                
            } else {
                return res.status(400).json({'status': false, 'errors': 'Invalid Param'})
            }
        }
    }

    

    

    User.aggregate([
        {$match: {...params}},
        {
            $lookup: {
                from: 'departments',
                localField: 'department_id',
                foreignField: '_id',
                as: 'department_id'
            }
        },
        {
            $lookup: {
                from: 'designations',
                localField: 'designation_id',
                foreignField: '_id',
                as: 'designation_id'
            }
        },
        {
            $lookup: {
                from: 'user_roles',
                localField: '_id',
                foreignField: 'user_id',
                as: 'user_roles',
                pipeline: [
                    {
                        $lookup: {
                            from: 'roles'   ,
                            localField: 'role_id',
                            foreignField: '_id',
                            as: 'roles'
                        }
                    },{
                        $unwind:{
                            path:"$roles",
                            preserveNullAndEmptyArrays:false
                        }
                    }
                ]
            }
        }
    ])
    .skip(skip)
    .limit(limit)
    .exec((err, datas)=>{
        if(err) return res.status(500).json({'status': false, 'errors': err})
        res.status(200).json({'status': true, 'pagination': {total, limit, totalPages}, 'datas': datas})
    })
    /* User.find({...req.params.id?{_id: req.params.id}:''}).populate([
        {path: 'department_id', model: 'Department', select: 'department_name'},
        {path: 'designation_id', model: 'Designation', select: 'designation_name'}
    ]).exec((err, datas)=>{
        if(err) {
            return res.status(500).json({'status': false, 'errors': err})
        }
        (datas)?res.status(200).json({'status': true, 'datas': datas}):
        res.status(404).json({'status': false, 'errors': 'No datas found'})
    }) */
}

exports.filter = async (req, res) => {
    const {search, page} = req.query

    let params = {}, limit = 25, skip = (page - 1) * limit, total = 0, totalPages = 0
    if(search) {
        params = {
            $or: [
                { name: { $regex: search, '$options': 'i' } },
                // { employee_id: { $regex: search, '$options': 'i' } },
                { official_email: { $regex: search, '$options': 'i' } }
            ]
        }
    }


        let userCount = await User.aggregate([
            {$match: {...params}},
          
            {
                $count: "count"
            }
        ])
        total = userCount.length && userCount[0].count

    
        if(!page || page == 1){
            skip = 0
        }else{
            skip = parseInt(page) - 1  * limit
        }


    User.aggregate([
        {$match: {...params}},
        // {
        //     $lookup: {
        //         from: 'departments',
        //         localField: 'department_id',
        //         foreignField: '_id',
        //         as: 'department_id'
        //     }
        // },
        // {
        //     $lookup: {
        //         from: 'designations',
        //         localField: 'designation_id',
        //         foreignField: '_id',
        //         as: 'designation_id'
        //     }
        // },
        // {
        //     $lookup: {
        //         from: 'user_roles',
        //         localField: '_id',
        //         foreignField: 'user_id',
        //         as: 'user_roles',
        //         pipeline: [
        //             {
        //                 $lookup: {
        //                     from: 'roles',
        //                     localField: 'role_id',
        //                     foreignField: '_id',
        //                     as: 'roles'
        //                 }
        //             },
        //             {
        //                 $unwind:{
        //                     path:'$roles',
        //                     preserveNullAndEmptyArrays:true
        //                 } 
        //             }
        //         ]
        //     }
        // }
    ])
    .skip(skip)
    .limit(limit)
    .exec((err, datas)=>{
        if(err) return res.status(500).json({'status': false, 'errors': err})
        res.status(200).json({'status': true, 'pagination': {total, limit, totalPages}, 'datas': datas})
    })
}

exports.profile = async (req, res) => {
    
    await User.aggregate([
        {$match: {_id:ObjectId(req.params.id)}},
        {
            $lookup: {
                from: 'departments',
                localField: 'department_id',
                foreignField: '_id',
                as: 'department_id'
            }
        },
        {
            $lookup: {
                from: 'designations',
                localField: 'designation_id',
                foreignField: '_id',
                as: 'designation_id'
            }
        },
        {
            $lookup: {
                from: 'user_roles',
                localField: '_id',
                foreignField: 'user_id',
                as: 'user_roles',
                pipeline: [
                    {
                        $lookup: {
                            from: 'roles',
                            localField: 'role_id',
                            foreignField: '_id',
                            as: 'roles'
                        }
                    }
                ]
            }
        }
    ])
    .exec((err, datas)=>{
        if(err) return res.status(500).json({'status': false, 'errors': err})
        res.status(200).json({'status': true, 'data': datas})
    })
}

exports.create = (upload,multer) =>{

    return (req, res)=>{
        let image = ''
        upload(req, res, (err)=>{
            if (req.fileValidationError) {
                return res.status(422).json({'status': false,'errors': req.fileValidationError})
            }
            else if (err instanceof multer.MulterError || err) {
                return res.status(422).json({'status': false,'errors': err})
            }
            else {
                if(req.file) {
                    image = req.file.path.includes("public\\")?req.file.path.split('public\\')[1].replace(/\\/gi,'/'):req.file.path.split('public/')[1]
                }
            }
            let userData = Object.assign({}, req.body)
            let password = userData.name.slice(0,4).concat(Math.random().toString(36).slice(2))
            userData.password = bcrypt.hashSync(password, salt)
            delete userData.user
            if(image !== '') {
                userData.profile_photo = image
            }
            rolesData = []
            User.create(userData, (err, data)=>{
                if(err) {
                    if(req.file) {
                        fs.unlinkSync('public/'+image)
                    }
                    return res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)})
                }
                let mailOptions = {
                    to:req.body.official_email,
                    subject: "Fidelitus Corp CRM",
                    template: 'sharecredentials',
                    context:{
                        name:userData.name,
                        id:userData.employee_id,
                        password:password,
                    }
                }
                mail.sendMail(mailOptions)
                res.status(201).send({Status:true,message:'Credential shared to the user'})
            })
        })
    }
}

exports.complete_onboard_process_hr = (upload, multer) => {
    return (req,res)=>{
        let image = ''
        upload(req, res, (err)=>{
            if (req.fileValidationError) {
                return res.status(422).json({'status': false,'errors': req.fileValidationError})
            }
            else if (err instanceof multer.MulterError || err) {
                return res.status(422).json({'status': false,'errors': err})
            }
            else {
                if(req.file) {
                    image = req.file.path.includes("public\\")?req.file.path.split('public\\')[1].replace(/\\/gi,'/'):req.file.path.split('public/')[1]
                }
            }
            
            if(image !== '') {
                userData.profile_photo = image
            }
            if(req.params.id){
                    User.findByIdAndUpdate(req.params.id,{...req.body},{new:true},(err,data)=>{
                        if(req?.body?.roles?.length > 0){
                            req.body.roles.forEach(element => {
                                rolesData.push({user_id: data.id, role_id: element})
                            });
                            saveRoles(rolesData)
                        }
                        let password = data.name.slice(0,4).concat(Math.random().toString(36).slice(2))
                        data.password = bcrypt.hashSync(password, salt)
                        data.save().then((result)=>{
                            let mailOptions = {
                                to: result.official_email,
                                // template:
                                subject: "CRM Onboard",
                                html: `<h1>Hello ${result.name},</h1>
                                <p>Please find your credentials below</p>
                                <p>
                                    UserID: ${result.employee_id}<br>
                                    Password: ${password}
                                </p>
                                `
                            }
                            mail.sendMail(mailOptions)
                            res.status(200).send({status:true,message:'User data updated successfully'})
                        }).catch((err)=>{
                            res.status(403).send({status:false,err})
                        })
                    })
            }
            else{
                rolesData = []
                User.create(userData, (err, data)=>{
                    if(err) {
                        if(req.file) {
                            fs.unlinkSync('public/'+image)
                        }
                        return res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)})
                    }
                    if(req.body.roles.length > 0){
                        req.body.roles.forEach(element => {
                            rolesData.push({user_id: data.id, role_id: element})
                        });
                        saveRoles(rolesData)
                    }
                    
                    
                    // let mailOptions = {
                    //     to: data.official_email,
                    //     subject: "CRM Onboard",
                    //     html: `<h1>Hello ${data.name},</h1>
                    //     <p>Please find your credentials below</p>
                    //     <p>
                    //         UserID: ${data.employee_id}<br>
                    //         Password: ${password}
                    //     </p>
                    //     `
                    // }
                    // mail.sendMail(mailOptions)
                    res.status(201).json({'status': true, 'datas': {data, rolesData}})
                })
            }      
                // res.status(201).json({'status': true, 'datas': {data, rolesData}})
            })


         
    }        
         
}

exports.update = (upload, multer) => {
    return (req, res)=>{
        let image = ''
        upload(req, res, (err)=>{
            if(req.file) {
                if (req.fileValidationError) {
                    return res.status(422).json({'status': false, 'errors': req.fileValidationError})
                }
                else if (err instanceof multer.MulterError || err) {
                    return res.status(500).json({'status': false, 'errors': err})
                }
                else {
                    image = req.file.path.includes("public\\")?req.file.path.split('public\\')[1].replace(/\\/gi,'/'):req.file.path.split('public/')[1]
                }
            }
            User.aggregate([{$match: {_id: ObjectId(req.params.id)}},{
                $lookup: {
                    from: 'user_roles',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'user_roles'
                }
            },{
                $lookup: {
                    from: 'roles',
                    localField: 'user_roles.role_id',
                    foreignField: '_id',
                    as: 'roles'
                }
            }], (err, data)=>{
                if(err) return res.status(500).json({'status': false, 'errors': err})
                if(data) {
                    let userData = Object.assign({}, req.body)
                    delete userData.user
                    delete userData.dob
                    if(image !== '') {
                        userData.profile_photo = image
                    }
                    if(req.body.password) {
                        userData.password = bcrypt.hashSync(req.body.password, salt)
                    }
                    rolesData = []
                    User.findOneAndUpdate({_id: req.params.id}, userData, { runValidators: true, context: 'query', new: true }, (err, updatedData)=>{
                        if(err) return res.status(422).json({'status': false, 'errors': errFormatter.formatError(err.message)})
                        if(image !== '') {
                            if(data[0].profile_photo && fs.existsSync('public/'+data[0].profile_photo)) {
                                fs.unlinkSync('public/'+data[0].profile_photo)
                            }
                        }
                        if(req.body.roles) {
                            req.body.roles.forEach(element => {
                                rolesData.push({user_id: req.params.id, role_id: element})
                            });
                            UserRole.deleteMany({user_id: req.params.id, role_id: {$nin: rolesData.map((role)=>role.role_id)}}, (err, data)=>{})
                        }
                        if(rolesData.length) {
                            saveRoles(rolesData)
                        }
                        res.status(200).json({'status': true, 'datas': {updatedData, rolesData}})
                    })
                }
            })
        })
    }
}

exports.changeProfilePhoto = (upload, multer) => {
    return (req, res) => {
        let userId = req.body.user.id
        upload(req, res, (err)=>{
            if(err) return res.status(500).json({'status': false, 'errors': err})
            if(!req.file) return res.status(422).json({'status': false, 'errors': 'No image selected'})
            if (req.fileValidationError) {
                return res.status(422).json({'status': false, 'errors': req.fileValidationError})
            }
            else if (err instanceof multer.MulterError || err) {
                return res.status(500).json({'status': false, 'errors': err})
            }
            
            User.findOne({_id: userId}, (err, data)=>{
                if(err) return res.status(500).json({'status': false, 'errors': err})
                if(data.profile_photo) {
                    fs.unlinkSync('public/'+data.profile_photo)
                }
                User.updateOne({_id: userId}, {profile_photo: req.file.path.includes("public\\")?req.file.path.split('public\\')[1].replace(/\\/gi,'/'):req.file.path.split('public/')[1]}, { runValidators: true, context: 'query', new: true }, (err, data)=>{
                    if(err) return res.status(500).json({'status': false, 'errors': err})
                    res.status(200).json({'status': true, 'datas':{data:data,photo:req.file.path.includes("public\\")?req.file.path.split('public\\')[1].replace(/\\/gi,'/'):req.file.path.split('public/')[1]}})
                })
            })
        })
    }
}

exports.sendResetPasswordLink = async (req, res)=>{
    let params = {}
    if(req.body.user_id.match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
        params = {official_email: req.body.user_id}
    }
    else {
        params = {employee_id: req.body.user_id}
    }
    const response = await User.findOne(params)
    if(response) {
        await VerifyToken.deleteMany({$and: [{type: 'reset_password', type_id: response.employee_id}]})
        let payload = {
            employee_id: response.employee_id
        }
        token = jwt.createToken(payload, '1h')
        let mailOptions = {
            to: response.official_email,
            subject: "Reset Password",
            template: 'resetpassword',
            context:{
                link:`${process.env.APP_URL}/password_reset?token=${token}`
            }
        }
        VerifyToken.create({
            type: 'reset_password',
            type_id: payload.employee_id,
            token: token
        }, (err, data)=>{
            if(err) return res.status(500).json({'status': false, 'errors': err})
            mail.sendMail(mailOptions)
            return res.status(200).json({'status': true, 'datas': 'Email sent'})
        })
    }
    else {
        res.status(404).json({'status': false, 'errors': 'User not found'})
    }
    
}

exports.verifyResetToken = (req, res) => {
    verifyResetJwt(req.query.token, res)
}

exports.resetPassword = (req, res) => {
    verifyResetJwt(req.query.token, res, true, {...req.body})
}

const verifyResetJwt = (token, res, reset = false, datas={})=>{
    let decoded = jwt.verifyVerificationToken(token)
    if("employee_id" in decoded) {
        VerifyToken.findOne({type: 'reset_password', type_id: decoded.employee_id, token: token}, (err, data)=>{
            if(err) {
                res.redirect(`${process.env.UI_URL}/token_expired`)
            }else {
                if(data) {
                    if(reset) {
                        if(datas.password === datas.confirm_password) {
                            User.updateOne({employee_id: decoded.employee_id}, {password: bcrypt.hashSync(datas.password, salt)}, (err, data)=>{
                                if(err) res.status(500).json({'status': false, 'errors': err})
                                VerifyToken.deleteOne({type: 'reset_password', type_id: decoded.employee_id}, (err, data)=>{
                                    if(err) res.status(500).json({'status': false, 'errors': err})
                                    res.status(200).json({'status': true, 'datas': data})
                                })
                            })
                        }
                        else {
                            return res.status(422).json({'status': false, 'errors': 'Password and Confirm password is not same'})
                        }
                    }
                    else {
                        res.redirect(`${process.env.UI_URL}/reset-password?token=${token}`)
                    }
                }
                else {
                    res.redirect(`${process.env.UI_URL}/token_expired`)
                }
            }
        })
    }
    else if("name" in decoded) {
        res.redirect(`${process.env.UI_URL}/token_expired`)
    }
    else {
        res.redirect(`${process.env.UI_URL}/token_expired`)
    }
}

exports.changePassword = async (req, res) => {

    let errors = []
    if(!req.body.password) {
        errors.push({'password': 'Password is required'})
    }
    if(!req.body.password_confirmation) {
        errors.push({'password_confirmation': 'Password Confirmation is required'})
    }
            let user = await User.findById({_id:req.body.user.id}).exec() 
            if(user){
                let password_match = await bcrypt.compare(req.body.old_password,user.password)
                if(!password_match){
                    res.status(403).json({'status':false,'msg':'Old password did not match '})
                }else{
                    let password = bcrypt.hashSync(req.body.password_confirmation, salt)
                    User.findOneAndUpdate({_id: req.body.user.id}, {password:password },{new:true}, (err, data)=>{
                        if(err) res.status(500).json({'status': false, 'errors': err})
                        res.status(200).json({'status': true, 'datas': data})
                    })
                    }
                }
              else {
                  errors.push({'password_confirmation': 'Password and Confirm Password is not matching'})
            }
   
    if(errors.length) {
        res.status(422).json({'status': false, 'errors': Object.assign(...errors)})
    }
    
}

exports.userLogin = (req, res) => {
    User.findOne({
        $and: [
                {$or: [{phone: req.body.user_id}, {email: req.body.user_id}]}, 
                // {$or: [{isActive: true},]}
        ]
        // {is_partially_verified:false},{sent_for_review:false},{app_access:true}
       
    }) .populate([ 'designation_id']).exec((err, data)=>{

        if(err) {
            res.status(500).json({'status': false, 'errors': err.errors})
        }
        else {
            if(data) {
                if(bcrypt.compareSync(req.body.password, data.password)) {

                    const payload = {
                        id: data.id,
                        name: data.name,
                        phone: data.phone,
                        email: data.email,
                        image:data.profile_photo,
                        is_verified: data.is_verified,
                        is_partially_verified: data.is_partially_verified,
                        sent_for_review: data.sent_for_review,
                        app_access: data.app_access,
                        is_active: data.is_active,
                        exit_form:data.exit_form,
                        designation_id:data.designation_id,
                        dob:data.dob,
                        doj:data.doj,
                    }
                    UserRole.find({user_id: payload.id}).populate({path: 'role_id',model: 'Role', select: 'role_name'}).exec(async(err, roleData)=>{
                        if(err) {
                            res.status(500).json({'status': false, 'errors': err.errors})
                        }
                        else {
                            payload.roles = roleData?.length?roleData.map((role)=>role?.role_id?.role_name):[]
                            payload.token = jwt.createToken(payload)
                            payload.status = true
                            //Adding access token to database
                            UserAccessToken.create({
                                user_id: payload.id,
                                access_token: payload.token
                            })
                            //fcm token creation
                        
                            res.status(200).json(payload)
                        }
                    })
                }
                else {
                    res.status(401).json({'status': false, 'errors': 'Invalid Password'})
                }
            }
            else {
                res.status(401).json({'status': false, 'errors': 'Invalid FCPL ID'})
            }
        }
    })
}

exports.userLogOut = (req, res) => {
    UserAccessToken.findOne({$and:[{_id: req.body.user.id}, {token: req.headers.authorization.split(' ')[1]}]}, (err, data)=>{
        if(err) return res.status(500).json({'status': false, 'errors': err.errors})
        if(data) {
            UserAccessToken.deleteOne({$and:[{_id: req.body.user.id}, {token: req.headers.authorization.split(' ')[1]}]}, (err, data)=>{
                if(err) return res.status(500).json({'status': false, 'errors': err.errors})
                res.status(200).json({'status': true, 'datas': 'Logged out successfully'})
            })
        }
        else {
            res.status(406).json({'status': false, 'errors': 'Invalid user'})
        }
    })
    
}

exports.assignRoles = async (req, res) => {
    let rolesData = []

    req.body.roles.forEach(item=>{
        rolesData.push({user_id: req.body.user_id, role_id: item})
    })
    UserRole.deleteMany({user_id: req.body.user_id, role_id: {$nin: rolesData.map((role)=>role.role_id)}}, (err, data)=>{})
    saveRoles(rolesData)
    res.status(200).json({'status': true, 'datas': rolesData})
}

exports.deleteRole = (req, res) => {
    UserRole.findOne({_id: req.body.id}, (err, data)=>{
        if(err) return res.json(500).json({'status': false, 'errors': err})
        if(data) {
            UserRole.deleteOne({_id: req.body.id}, (err, data)=>{
                err ? res.json(500).json({'status': false, 'errors': err}):
                res.json(200).json({'status': true, data: data})
            })
        }
        else {
            res.json(500).json({'status': false, 'errors': 'Role not found'})
        }
    })
}

exports.changepassword_admin = async (req,res) => {
    let password =  bcrypt.hashSync(req.body.password, salt)
    req.body.password = password

    return await User.findOneAndUpdate({_id:req.body.user_id},req.body,{new:true},(err,data)=>{
        err && res.status(422).send({status:false,err:err})
        data && res.status(200).send({status:true,message:'Password Updated Successfully'})
    }).clone()
}

exports.update_application = async (req,res) =>{
    let password = req.body.name.slice(0,4).concat(Math.random().toString(36).slice(2))
    req.body.password = bcrypt.hashSync(password, salt)

    return User.find({_id:req.params.id},async(err,data)=>{
        err && res.status(403).send({status:false,err})
        if(data !== null){
           
            await User.findByIdAndUpdate(req.params.id,req.body,{new:true},(err,data)=>{
                err && res.status(403).send({status:false,err})
                if(data){
                if(req.body.shareCredentials  == '1'){    
                        let mailOptions = {
                            to:req.body.official_email,
                            subject: "Congrats your now a part of Family[FidelitusCorp]",
                            template: 'sharecredentials',
                            context:{
                                name:req.body.name,
                                id:data.employee_id,
                                password:password,
                            }
                        }
                        mail.sendMail(mailOptions)
                        res.status(200).send({Status:true,message:'Credential shared to the user'})
                }else{
                    res.status(200).send({Status:true,message:'User account updated successfully'})
                }
                }
            }).clone()
        }else{
            res.status(404).send({status:false,err:'Data not found'})
        }
    }).clone()
}

exports.reshareCredentials = async (req,res) =>{
    let password = req.body.name.slice(0,4).concat(Math.random().toString(36).slice(2))
    req.body.password = bcrypt.hashSync(password, salt)
    return User.find({_id:req.params.id},(err,data)=>{
        err && res.status(403).send({status:false,err})
        if(data !== null){
            User.findByIdAndUpdate(req.params.id,req.body,{new:true},(err,data)=>{
                err && res.status(403).send({status:false,err})
                if(data){
                let mailOptions = {
                    to:req.body.official_email,
                    subject: "Reshared request : Fidelitus Corp CRM",
                    template: 'resharecredentials',
                    context:{
                        name:req.body.name,
                        id:data.employee_id,
                        password:password,
                    }
                }
                mail.sendMail(mailOptions)
                res.status(200).send({Status:true,message:'Credential shared to the user'})
                }
            })
        }else{
            res.status(404).send({status:false,err:'Data not found'})
        }
    }).clone()
}

exports.resetPassword1 = async (req,res)=>{
    return await User.findOne({official_email:req.body.official_email},(err,data)=>{
        err && res.status(403).send({status:false,'error':err})
        if(data !== null){
             if(data.is_active && data.is_verified){
              if(req.body.password.length < 8){
                res.status(403).send({status:false,err:'Password should be atleast 8 characters'})
              }else if(req.body.password !== req.body.confirm_password){
                res.status(403).send({status:false,error:'Password did not match'})
              }else{
                if(data.otp = req.body.otp){
                    // data.otp = ''
                    // data.password = bcrypt.hashSync(req.body.password, salt)
                    user.findByIdAndUpdate(data._id,{otp:'',password: bcrypt.hashSync(req.body.password, salt)},{new:true},(err,data)=>{
                        res.status(200).send({status:true,message:'Password Updated Successfully'})

                    })
                  }else{
                     res.status(403).send({status:false,error:'Otp did not match'})
                  } 
              } 
              
              
              
             }else{
                 res.status(404).send({status:false,error:'Your account is not verified or in active'})
             }
        }else{
          res.status(404).send({status:false,error:'User not found this provided email id'})
        }
      }).clone()
}

exports.verifyOtp = async(req,res)=>{
    return await User.findOne({official_email:req.body.official_email},(err,data)=>{
        err && res.status(403).send({status:false,'error':err})
        if(data !== null){
              
                if(data.otp == req.body.otp){
                    res.status(200).send({status:false,error:'Otp is valid'})
                  }else{
                    res.status(403).send({status:false,error:'Otp did not match'})
                  } 
        }else{
            res.status(404).send({status:false,error:'Your account does not exist'})
        }
      }).clone()
}

exports.getUserOperator = async(req,res)=>{
   let params = {}
   await User.aggregate([
            {$match:{...params}},
            {$project:{
                _id:1 ,
                name:1,
            }}
   ]).exec((err,data)=>{
     return res.status(200).send(data)
   })
}

exports.getUserOperatorBasedFilter = async(req,res)=>{
       let search = req.query.search
       await User.aggregate([
       
        {$match: {
                $and:[{name:{ $regex: search, '$options': 'i' }}]}},
                {
                    $lookup:{
                        from:'departments',
                        localField:'department_id',
                        foreignField:'_id',
                        as:'department_id'
                    }
                },
                {$project:{
                    _id:1 ,
                    name:1,
                    employee_id:1

                }}
       ]).exec((err,data)=>{
         return res.status(200).send(data)
       })
}

exports.deleteEmployeeOnboarded = async(req,res)=>{
    return User.findByIdAndDelete(req.params.id,(err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:data})
    }).clone()
}

exports.disableAppAccess = async(req,res)=>{
    return User.findByIdAndUpdate(req.params.id,{app_access:false},(err,data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:data})
    }).clone()
}

exports.deletemass = async(req,res)=>{
    await user.deleteMany({});
    await lead.deleteMany({});
   
    return res.status(200).send({staus:true,'message':'success'})
}    

exports.getmyTargetAndAchieved = async(req,res)=>{
    const insentive_requirement = await InsentiveRequirment.findOne({is_active:true})
    let params = {'user':ObjectId(req.body.user.id),'incentive':ObjectId(insentive_requirement._id)}
    return await EmployeeTarget.aggregate([
           {$match:params},
           {
            $lookup:{
                from:'incentiverequirments',
                localField:'incentive',
                foreignField:'_id',
                as:'incentive'
            }
           },
           {
            $unwind:{
                path:'$incentive',
                preserveNullAndEmptyArrays:true
            }
           }
    ]).exec((err,data)=>{
          err && res?.status(200).send({status:false,err})
          data && res?.status(200).send({status:true,data})
    })
        
}

exports.targetAchievedWithRevenue = async(req,res)=>{
    const department = await Department.findOne({department_name:'Transaction Team'})
    const insentive_requirement = await InsentiveRequirment.findOne({is_active:true})
    let params = {'department_id':ObjectId(department._id),'is_active':1}
    let params1 = {'incentive':ObjectId(insentive_requirement._id)}


    // {
    //     $lookup:{
    //         from:'incentiverequirments',
    //         localField:'incentive',
    //         foreignField:'_id',
    //         as:'incentive'
    //     }
    // },
    // {
    //     $unwind:{
    //         path:'$incentive',
    //         preserveNullAndEmptyArrays:true
    //     }
    // }
    // {$match: {department_id: ObjectId(req.params.id)}},
    if(department !== null){
        return await User.aggregate([
            {$match:params},
            {
                $lookup:{
                    from:'designations',
                    localField:'designation_id',
                    foreignField:'_id',
                    as:"designation_id"
                },
            },    
            {
                $unwind:{
                    path:'designation_id',
                    preserveNullAndEmptyArrays:true
                }
            }
            
        ]).exec((err,data)=>{
            err && res?.status(200).send({status:false,err})
            data && res?.status(200).send({status:true,data})
        })
        return EmployeeTarget
   }
        
}