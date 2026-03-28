const budgetService = require('../services/BudgetService');
const logger = require('../utils/logger');

class BudgetController {
  async getByPatientId(req, res) {
    try {
      const { patientId } = req.params;
      const budgets = await budgetService.findByPatientId(patientId);
      res.json(budgets);
    } catch (error) {
      logger.error('Error in getByPatientId budgets:', error);
      res.status(500).json({ error: 'Failed to fetch budgets' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const budget = await budgetService.findById(id);
      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }
      res.json(budget);
    } catch (error) {
      logger.error('Error in getById budget:', error);
      res.status(500).json({ error: 'Failed to fetch budget' });
    }
  }

  async create(req, res) {
    try {
      const budget = await budgetService.create(req.body);
      res.status(201).json(budget);
    } catch (error) {
      logger.error('Error in create budget:', error);
      res.status(500).json({ error: 'Failed to create budget' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const budget = await budgetService.update(id, req.body);
      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }
      res.json(budget);
    } catch (error) {
      logger.error('Error in update budget:', error);
      res.status(500).json({ error: 'Failed to update budget' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await budgetService.delete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Budget not found' });
      }
      res.status(204).send();
    } catch (error) {
      logger.error('Error in delete budget:', error);
      res.status(500).json({ error: 'Failed to delete budget' });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const budget = await budgetService.updateStatus(id, status);
      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }
      res.json(budget);
    } catch (error) {
      logger.error('Error in updateStatus budget:', error);
      res.status(500).json({ error: 'Failed to update budget status' });
    }
  }
}

module.exports = new BudgetController();
