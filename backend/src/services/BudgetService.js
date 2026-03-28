const { Budget, BudgetItem, Patient, Dentist, Treatment } = require('../models');
const logger = require('../utils/logger');

class BudgetService {
  async findByPatientId(patientId) {
    try {
      const budgets = await Budget.findAll({
        where: { patientId },
        include: [
          { model: Patient, as: 'patient', attributes: ['id', 'name', 'lastName'] },
          { model: Dentist, as: 'dentist', attributes: ['id', 'name', 'lastName'] },
          { model: BudgetItem, as: 'items' },
        ],
        order: [['createdAt', 'DESC']],
      });
      return budgets;
    } catch (error) {
      logger.error(`Error fetching budgets for patient ${patientId}:`, error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const budget = await Budget.findByPk(id, {
        include: [
          { model: Patient, as: 'patient', attributes: ['id', 'name', 'lastName', 'email'] },
          { model: Dentist, as: 'dentist', attributes: ['id', 'name', 'lastName'] },
          { model: BudgetItem, as: 'items' },
        ],
      });
      return budget;
    } catch (error) {
      logger.error(`Error fetching budget ${id}:`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      const { items, ...budgetData } = data;
      
      const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      const discount = budgetData.discount || 0;
      const total = subtotal - discount;

      const validUntil = budgetData.validUntil || 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const budget = await Budget.create({
        ...budgetData,
        subtotal,
        discount,
        total,
        validUntil,
      });

      if (items && items.length > 0) {
        const budgetItems = items.map(item => ({
          budgetId: budget.id,
          treatmentId: item.treatmentId,
          treatmentName: item.treatmentName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.unitPrice * item.quantity,
          notes: item.notes || '',
        }));
        await BudgetItem.bulkCreate(budgetItems);
      }

      logger.info(`Budget created with id: ${budget.id}`);
      return await this.findById(budget.id);
    } catch (error) {
      logger.error('Error creating budget:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const budget = await Budget.findByPk(id);
      if (!budget) {
        return null;
      }

      const { items, ...budgetData } = data;
      
      let subtotal = budget.subtotal;
      let total = budget.total;

      if (items) {
        await BudgetItem.destroy({ where: { budgetId: id } });
        
        const newSubtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        const discount = budgetData.discount || budget.discount || 0;
        
        subtotal = newSubtotal;
        total = subtotal - discount;

        const budgetItems = items.map(item => ({
          budgetId: id,
          treatmentId: item.treatmentId,
          treatmentName: item.treatmentName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.unitPrice * item.quantity,
          notes: item.notes || '',
        }));
        await BudgetItem.bulkCreate(budgetItems);
      }

      await budget.update({
        ...budgetData,
        subtotal,
        total: budgetData.discount !== undefined ? subtotal - budgetData.discount : total,
      });

      logger.info(`Budget ${id} updated`);
      return await this.findById(id);
    } catch (error) {
      logger.error(`Error updating budget ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const budget = await Budget.findByPk(id);
      if (!budget) {
        return false;
      }
      await BudgetItem.destroy({ where: { budgetId: id } });
      await budget.destroy();
      logger.info(`Budget ${id} deleted`);
      return true;
    } catch (error) {
      logger.error(`Error deleting budget ${id}:`, error);
      throw error;
    }
  }

  async updateStatus(id, status) {
    try {
      const budget = await Budget.findByPk(id);
      if (!budget) {
        return null;
      }
      await budget.update({ status });
      logger.info(`Budget ${id} status updated to ${status}`);
      return await this.findById(id);
    } catch (error) {
      logger.error(`Error updating budget status ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new BudgetService();
