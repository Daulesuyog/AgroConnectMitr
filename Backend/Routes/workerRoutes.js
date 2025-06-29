import { registerWorker, loginWorker, getAllWorkers, getWorkerById, getWorkersBySkill} from "../Controllers/workerControllers.js";
import express from 'express';
import { verifyAuth } from "../Middleware/Auth.js";

const router = express.Router();

router.post("/register", registerWorker);
router.post("/login", loginWorker);
router.get("/", verifyAuth("farmer"), getAllWorkers);
router.get("/:workerid", verifyAuth("farmer", "worker"), getWorkerById);
router.get("/skill/:skill", verifyAuth("farmer", "worker"), getWorkersBySkill);

// New route for updating UPI (post-registration)
router.put('/update-upi', verifyAuth("worker"), (req, res) => {
    // This route will be handled by paymentRoutes.js
    res.status(400).json({ message: "Use /api/payment/update-upi instead" });
});

export default router;