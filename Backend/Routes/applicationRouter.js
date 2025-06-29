import { applytoAgroConnect, getApplicationsbyJob, getApplicationsbyWorker, updateApplicationStatus, deleteApplication, } from "../Controllers/applicationControllers.js";
import express from 'express';
import { verifyAuth } from '../Middleware/Auth.js';

const router = express.Router();

router.post("/apply", verifyAuth("worker"), applytoAgroConnect);
router.get("/job/:job_id", verifyAuth("farmer"), getApplicationsbyJob);

router.get("/worker/:worker_id", verifyAuth("worker"), getApplicationsbyWorker);
router.put("/status", verifyAuth("farmer"), updateApplicationStatus);
router.delete("/delete/:id", verifyAuth("farmer", "worker"), deleteApplication);    

export default router;