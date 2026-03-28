require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/app');
const { connectDB } = require('./config/database');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const patientRoutes = require('./routes/patientRoutes');
const dentistRoutes = require('./routes/dentistRoutes');
const treatmentRoutes = require('./routes/treatmentRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const dentalRecordRoutes = require('./routes/dentalRecordRoutes');
const cariogramRoutes = require('./routes/cariogramRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const medicalHistoryRoutes = require('./routes/medicalHistoryRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/patients', patientRoutes);
app.use('/api/dentists', dentistRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/dental-records', dentalRecordRoutes);
app.use('/api/cariograms', cariogramRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/medical-histories', medicalHistoryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
