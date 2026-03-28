const express = require('express');
const router = express.Router();
const MedicalHistoryController = require('../controllers/MedicalHistoryController');

router.get('/patient/:patientId', MedicalHistoryController.getByPatientId);
router.get('/:id', MedicalHistoryController.getById);
router.post('/', MedicalHistoryController.create);
router.post('/note/:patientId', MedicalHistoryController.addNote);
router.post('/entry/:patientId', MedicalHistoryController.addEntry);

module.exports = router;
