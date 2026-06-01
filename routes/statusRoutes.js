const express = require('express');
const router = express.Router();
const { getStatuses, getStatus, createStatus, updateStatus, deleteStatus, exportStatuses } = require('../controllers/statusController');

router.get('/export', exportStatuses);  // must be before /:id
router.get('/', getStatuses);
router.get('/:id', getStatus);
router.post('/', createStatus);
router.put('/:id', updateStatus);
router.delete('/:id', deleteStatus);

module.exports = router;
