const express = require('express');
const router = express.Router();
const TreatmentController = require('../controllers/TreatmentController');
const { validateTreatment } = require('../middleware/validation');

router.get('/', TreatmentController.getAll);
router.get('/:id', TreatmentController.getById);
router.post('/', validateTreatment, TreatmentController.create);
router.put('/:id', validateTreatment, TreatmentController.update);
router.delete('/:id', TreatmentController.delete);

module.exports = router;
