const express = require('express');
const router = express.Router();
const { getCouriers, getCourier, createCourier, updateCourier, deleteCourier } = require('../controllers/courierController');

router.get('/', getCouriers);
router.get('/:id', getCourier);
router.post('/', createCourier);
router.put('/:id', updateCourier);
router.delete('/:id', deleteCourier);

module.exports = router;
