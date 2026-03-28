const express = require('express');
const router = express.Router();
const BudgetController = require('../controllers/BudgetController');

router.get('/patient/:patientId', BudgetController.getByPatientId);
router.get('/:id', BudgetController.getById);
router.post('/', BudgetController.create);
router.put('/:id', BudgetController.update);
router.delete('/:id', BudgetController.delete);
router.patch('/:id/status', BudgetController.updateStatus);

module.exports = router;
