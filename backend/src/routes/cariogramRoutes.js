const express = require('express');
const router = express.Router();
const CariogramController = require('../controllers/CariogramController');

router.get('/:patientId', CariogramController.getByPatientId);
router.post('/', CariogramController.create);
router.put('/:patientId', CariogramController.update);
router.patch('/:patientId', CariogramController.upsert);

module.exports = router;
