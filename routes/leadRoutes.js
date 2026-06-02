const express = require('express');
const router = express.Router();
const { getLeads, getLeadById, createLead, updateLead, deleteLead } = require('../controllers/leadController');

router.route('/')
  .get(getLeads)
  .post(createLead);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(deleteLead);

module.exports = router;
