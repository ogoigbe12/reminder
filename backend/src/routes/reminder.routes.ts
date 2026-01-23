import { Router } from 'express';
import { getReminders, getReminder, createReminder, updateReminder, deleteReminder } from '../controllers/reminder.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

router.use(auth);

router.get('/', getReminders);
router.get('/:id', getReminder);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

export default router;
