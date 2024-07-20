const LandAllocate = require('../models/case')
const ObjectId = require('mongoose').Types.ObjectId

exports.get = async(req,res)=>{
    let roles = req.body.user.roles
    let params = {}

    if(roles.includes('hod')){
       params = {}
    }else{
       params = {created_by:ObjectId(req.body.user.id)}
    }

   //  const total_land_allocate = await LandAllocate.find(params).count()
   //  const total_calls = await UserCalls.find(params).count()
    return res.status(200).send({status:true,data:{land_allocate:0,total_calls:0}})
}