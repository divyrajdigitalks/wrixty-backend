const express = require('express');
const router = express.Router();
const { getRoles, getRole, createRole, updateRole, deleteRole, exportRoles } = require('../controllers/roleController');

router.get('/export', exportRoles);  // must be before /:id
router.get('/', getRoles);
router.get('/:id', getRole);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;
