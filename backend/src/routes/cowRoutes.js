import express from 'express';
import multer from 'multer';
import { addCow, getAllCows, getCow, editCow, deleteCow, getNearbyCows } from '../../controllers/cowController.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.diskStorage({}) });

// POST /api/add-cow
// images: up to 5 image files; video: optional single file
router.post('/add-cow', authRequired, upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'video', maxCount: 1 },
]), addCow);

// GET /api/cows
router.get('/cows', getAllCows);

// GET /api/cow/:id
router.get('/cow/:id', getCow);

// PUT /api/edit-cow/:id
router.put('/edit-cow/:id', authRequired, editCow);

// DELETE /api/cow/:id
router.delete('/cow/:id', authRequired, deleteCow);

// GET /api/nearby-cows
router.get('/nearby-cows', getNearbyCows);

export default router;

