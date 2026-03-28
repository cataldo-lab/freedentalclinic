const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/PatientController');
const { validatePatient } = require('../middleware/validation');

router.get('/', PatientController.getAll);
router.get('/search', PatientController.search);
router.get('/:id', PatientController.getById);
router.post('/', validatePatient, PatientController.create);
router.put('/:id', validatePatient, PatientController.update);
router.delete('/:id', PatientController.delete);

module.exports = router;
