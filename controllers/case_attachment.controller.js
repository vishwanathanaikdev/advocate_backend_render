const CaseAttachment = require('../models/case_attachment')
const errFormatter = require('../helpers/error.formatter')

exports.get = async (req, res)=>{
    return await CaseAttachment.find(({land_allocated:req.params.id}), (err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:data})
    }).clone() 
}

exports.create = (upload,multer)=>{
     let file;
     return (req,res)=>{
     upload(req,res, async(err)=>{
         if (req.fileValidationError) {
             return res.status(422).json({'status': false,'errors': req.fileValidationError})
         }
         else if (err instanceof multer.MulterError || err) {
             return res.status(422).json({'status': false,'errors': err})
         }
         else {
             if(req.file !== undefined) {
                 file = req.file.path.includes("public\\")?req.file.path.split('public\\')[1].replace(/\\/gi,'/'):req.file.path.split('public/')[1]
             }


             let body = Object.assign(req.body)
             body['file'] = file
             CaseAttachment.create(body, (err, data)=>{
             
                err && res.status(403).send({status:false,err:err})
                data && res.status(200).send({status:true,data:data})
             })
    }
    })
  }  
}

exports.update = (upload,multer)=>{
    let file;
    
    return (req,res)=>{
    upload(req,res, async(err)=>{
        if (req.fileValidationError) {
            return res.status(422).json({'status': false,'errors': req.fileValidationError})
        }
        else if (err instanceof multer.MulterError || err) {
            return res.status(422).json({'status': false,'errors': err})
        }
        else {
            if(req.file !== undefined) {
                file = req.file.path.includes("public\\")?req.file.path.split('public\\')[1].replace(/\\/gi,'/'):req.file.path.split('public/')[1]
            }

            let body = Object.assign(req.body)
            body['file'] = file
            CaseAttachment.findByIdAndUpdate(req.params.id,body, (err, data)=>{
               err && res.status(403).send({status:false,err:err})
               data && res.status(200).send({status:true,data:data})
            }) 
   }
   }).clone()     
 }  
}

exports.delete =async (req, res)=>{
    return await CaseAttachment.findByIdAndDelete(req.params.id, (err, data)=>{
        err && res.status(403).send({status:false,err:err})
        data && res.status(200).send({status:true,data:data})
    }).clone() 
}
