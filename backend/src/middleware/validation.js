const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const patientValidationRules = [
  body('name').notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('lastName').notEmpty().withMessage('Last name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email is required').isLength({ max: 255 }),
  body('phone').optional().isLength({ max: 20 }),
  body('address').optional().isLength({ max: 1000 }),
  body('dateOfBirth').optional().isISO8601().withMessage('Valid date is required'),
];

const dentistValidationRules = [
  body('name').notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('lastName').notEmpty().withMessage('Last name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email is required').isLength({ max: 255 }),
  body('specialty').optional().isLength({ max: 100 }),
  body('phone').optional().isLength({ max: 20 }),
  body('licenseNumber').optional().isLength({ max: 50 }),
];

const treatmentValidationRules = [
  body('name').notEmpty().withMessage('Name is required').isLength({ max: 200 }),
  body('description').optional().isLength({ max: 1000 }),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('durationMinutes').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
];

const appointmentValidationRules = [
  body('patientId').isInt({ min: 1 }).withMessage('Valid patient ID is required'),
  body('dentistId').isInt({ min: 1 }).withMessage('Valid dentist ID is required'),
  body('treatmentId').isInt({ min: 1 }).withMessage('Valid treatment ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('appointmentTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage('Valid appointment time is required'),
  body('status').optional().isIn(['scheduled', 'completed', 'cancelled', 'no_show']).withMessage('Invalid status'),
  body('notes').optional().isLength({ max: 1000 }),
];

const medicalRecordValidationRules = [
  body('patientId').isInt({ min: 1 }).withMessage('Valid patient ID is required'),
  body('dentistId').optional().isInt({ min: 1 }).withMessage('Valid dentist ID is required'),
  body('allergies').optional().isLength({ max: 1000 }),
  body('medicalConditions').optional().isLength({ max: 1000 }),
  body('medications').optional().isLength({ max: 1000 }),
  body('notes').optional().isLength({ max: 1000 }),
];

const dentalRecordValidationRules = [
  body('patientId').isInt({ min: 1 }).withMessage('Valid patient ID is required'),
  body('dentistId').optional().isInt({ min: 1 }).withMessage('Valid dentist ID is required'),
  body('occlusion').optional().isIn(['normal', 'maloclusion_clase_I', 'maloclusion_clase_II', 'malocluse_clase_III', 'abierta', 'cruzada']),
  body('periodontalStatus').optional().isIn(['sano', 'gingivitis', 'periodontitis_leve', 'periodontitis_moderada', 'periodontitis_severa']),
  body('hygieneGrade').optional().isIn(['buena', 'regular', 'mala']),
  body('observations').optional().isLength({ max: 2000 }),
];

const idValidationRules = [
  param('id').isInt({ min: 1 }).withMessage('Valid ID is required'),
  handleValidationErrors,
];

const patientIdValidationRules = [
  param('patientId').isInt({ min: 1 }).withMessage('Valid patient ID is required'),
  handleValidationErrors,
];

const validatePatient = [...patientValidationRules, handleValidationErrors];
const validateDentist = [...dentistValidationRules, handleValidationErrors];
const validateTreatment = [...treatmentValidationRules, handleValidationErrors];
const validateAppointment = [...appointmentValidationRules, handleValidationErrors];
const validateMedicalRecord = [...medicalRecordValidationRules, handleValidationErrors];
const validateDentalRecord = [...dentalRecordValidationRules, handleValidationErrors];

module.exports = {
  validatePatient,
  validateDentist,
  validateTreatment,
  validateAppointment,
  validateMedicalRecord,
  validateDentalRecord,
  idValidationRules,
  patientIdValidationRules,
};
