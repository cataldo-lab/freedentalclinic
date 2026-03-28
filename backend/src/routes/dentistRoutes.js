const express = require('express');
const router = express.Router();
const DentistController = require('../controllers/DentistController');
const { validateDentist } = require('../middleware/validation');

router.get('/', DentistController.getAll);
router.get('/:id', DentistController.getById);
router.post('/', validateDentist, DentistController.create);
router.put('/:id', validateDentist, DentistController.update);
router.delete('/:id', DentistController.delete);

module.exports = router;
