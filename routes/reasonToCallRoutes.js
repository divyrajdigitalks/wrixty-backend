const express = require('express');
const router = express.Router();
const { getReasonToCalls, getReasonToCall, createReasonToCall, updateReasonToCall, deleteReasonToCall, exportReasonToCalls } = require('../controllers/reasonToCallController');

router.get('/export', exportReasonToCalls);  // must be before /:id
router.get('/', getReasonToCalls);
router.get('/:id', getReasonToCall);
router.post('/', createReasonToCall);
router.put('/:id', updateReasonToCall);
router.delete('/:id', deleteReasonToCall);

module.exports = router;
