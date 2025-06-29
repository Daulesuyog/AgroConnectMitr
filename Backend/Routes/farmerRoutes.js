import {registrationfarmer, loginfarmer, getAllfarmers, getfarmerById, getfarmerByLocation, translateFarmIntro} from "../Controllers/farmerController.js";
import express from 'express';
import {verifyAuth }    from '../Middleware/Auth.js';

 const router = express.Router();

router.post('/register', registrationfarmer);
router.post("/login", loginfarmer);
router.get('/translate/farm_intro/:farmerid/:lang', translateFarmIntro);
router.get('/location/:location', verifyAuth("farmer"), getfarmerByLocation);
router.get('/:farmerid', verifyAuth("farmer"), getfarmerById);
router.get('/', verifyAuth("farmer"), getAllfarmers);

router.put('/update-upi', verifyAuth("farmer"), (req, res) => {
    // This route will be handled by paymentRoutes.js
    res.status(400).json({ message: "Use /api/payment/update-upi instead" });
});




export default router;
