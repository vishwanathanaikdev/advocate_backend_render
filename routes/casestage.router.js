const router = require('express').Router()

const caseStageController = require('../controllers/case_stage.controller')

router.get('/get/:id?',  caseStageController.get)
router.post('/create',  caseStageController.create)
router.post('/create-temp', caseStageController.create)
router.put('/update/:id',  caseStageController.update)
router.delete('/delete/:id',  caseStageController.delete)
router.get('/filter',  caseStageController.filter)

// [jwt.verifyToken, isRole.isRole(['admin', 'controller'])],
module.exports = router