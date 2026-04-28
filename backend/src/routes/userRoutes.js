import express from 'express';
import { registerUser, loginUser, updateFcmToken } from '../../controllers/userController.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// POST /api/register
router.post('/register', registerUser);

// POST /api/login
router.post('/login', loginUser);

// POST /api/update-fcm-token
router.post('/update-fcm-token', authRequired, updateFcmToken);

export default router;

