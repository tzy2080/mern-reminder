// Packages
const router = require('express').Router();

// Import middleware
const auth = require('../middleware/auth');

// Import controllers
const controller = require('../controllers/reminder');

// Get all reminder
router.get('/', auth, controller.getReminder);

// Create new reminder
router.post('/add', auth, controller.createReminder);

// Access specific reminder
router.get('/:id', auth, controller.getSpecificReminder);

// Delete reminder
router.delete('/:id', auth, controller.deleteReminder);

// Update reminder
router.post('/update/:id', auth, controller.updateReminder);

module.exports = router;