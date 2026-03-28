const express = require('express');
const router = express.Router();
const DentalRecordController = require('../controllers/DentalRecordController');
const { validateDentalRecord } = require('../middleware/validation');

router.get('/:patientId', DentalRecordController.getByPatientId);
router.post('/', validateDentalRecord, DentalRecordController.create);
router.put('/:patientId', validateDentalRecord, DentalRecordController.update);

module.exports = router;
