const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');
const { validateAppointment } = require('../middleware/validation');

router.get('/', AppointmentController.getAll);
router.get('/today', AppointmentController.getToday);
router.get('/date/:date', AppointmentController.getByDate);
router.get('/:id', AppointmentController.getById);
router.post('/', validateAppointment, AppointmentController.create);
router.put('/:id', validateAppointment, AppointmentController.update);
router.delete('/:id', AppointmentController.delete);

module.exports = router;
