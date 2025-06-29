import { createJob, getAllJobs, getJobById, updateJob, deleteJob, getPublicJobs } from "../Controllers/jobController.js";
import express from "express"
import { verifyAuth } from "../Middleware/Auth.js"

const router = express.Router();

router.post("/create", verifyAuth("farmer"), createJob);
router.get("/", verifyAuth(["farmer", "worker"]), getAllJobs);
router.get('/public', getPublicJobs)
router.get("/:jobid", verifyAuth("farmer", "worker"), getJobById);
router.put("/update/:jobid", verifyAuth("farmer"), updateJob);
router.delete("/delete/:jobid", verifyAuth("farmer"), deleteJob);

export default router;