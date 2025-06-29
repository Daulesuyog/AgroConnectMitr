import express from 'express';
import { verifyAuth } from '../Middleware/Auth.js';
import { updateUPI, getUPI, uploadScreenshot } from '../Controllers/paymentController.js';

const router = express.Router();

// Post-registration UPI update route
router.put('/update-upi', verifyAuth('farmer', 'worker'), updateUPI);

// Fetch UPI for payment (3-second visibility)
router.get('/get-upi/:user_id', verifyAuth('farmer', 'worker'), getUPI);

// Upload screenshot after UPI display
router.post('/screenshot', verifyAuth('farmer', 'worker'), uploadScreenshot);

export default router;