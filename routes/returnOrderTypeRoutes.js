const express = require('express');
const router = express.Router();
const {
  getReturnOrderTypes,
  getReturnOrderType,
  createReturnOrderType,
  updateReturnOrderType,
  deleteReturnOrderType,
  exportReturnOrderTypes
} = require('../controllers/returnOrderTypeController');

router.get('/export', exportReturnOrderTypes);  // must be before /:id
router.get('/', getReturnOrderTypes);
router.get('/:id', getReturnOrderType);
router.post('/', createReturnOrderType);
router.put('/:id', updateReturnOrderType);
router.delete('/:id', deleteReturnOrderType);

module.exports = router;
