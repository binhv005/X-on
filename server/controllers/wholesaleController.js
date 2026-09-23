import { wholesaleService } from '../services/wholesaleService.js';

export const submitWholesaleApplication = (req, res, next) => {
  try {
    const application = wholesaleService.submitApplication(req.body);
    res.status(201).json({
      success: true,
      message: 'Wholesale application submitted successfully! Our team will review your account credentials.',
      data: application
    });
  } catch (err) {
    next(err);
  }
};

export const getWholesaleApplications = (req, res, next) => {
  try {
    const apps = wholesaleService.getApplications(req.query);
    res.json({ success: true, data: apps });
  } catch (err) {
    next(err);
  }
};

export const updateWholesaleApplicationStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = wholesaleService.updateApplicationStatus(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Wholesale application not found' });
    }
    res.json({ success: true, message: 'Application updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};
