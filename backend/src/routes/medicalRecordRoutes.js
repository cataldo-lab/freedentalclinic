const express = require('express');
const router = express.Router();
const MedicalRecordController = require('../controllers/MedicalRecordController');
const { validateMedicalRecord } = require('../middleware/validation');

router.get('/:patientId', MedicalRecordController.getByPatientId);
router.post('/', validateMedicalRecord, MedicalRecordController.create);
router.put('/:patientId', validateMedicalRecord, MedicalRecordController.update);

module.exports = router;
