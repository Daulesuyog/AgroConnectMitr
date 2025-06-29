
import db from "../Models/AgroConnectMitr.js";

export const applytoAgroConnect = async (req, res) => {
    try {
        const {worker_id, job_id} = req.body;
        if (!worker_id || !job_id || isNaN(worker_id) || isNaN(job_id)) {
            return res.status(400).json({ message: "Invalid worker or job ID" });
        }
        const jobCheck = await db.query("SELECT * FROM jobs WHERE jobid = $1", [job_id]);
        if (jobCheck.rows.length === 0) {
            return res.status(404).json({ message: "Job not found" });
        }
        const exist = await db.query("select * from applications where worker_id = $1 and job_id = $2", [worker_id, job_id]);
        if(exist.rows.length > 0) {
            return res.status(400).json({ message: "You have already applied for this job." });
        }
        const result = await db.query (`insert into applications (worker_id, job_id, message, status) values ($1, $2, $3, 'pending') returning *`,
        [worker_id, job_id, req.body.message || 'Interested']);
        return res.status(201).json({ message: "Application submitted successfully", application: result.rows[0] }); 
    } catch(err) {
        console.error("Error applying to AgroConnect:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getApplicationsbyJob = async (req, res) => {
    try {
        const { job_id } = req.params;
        if (!job_id || isNaN(job_id)) {
            return res.status(400).json({ message: "Invalid job ID" });
        }
        const result = await db.query("SELECT a.*, w.name, w.email FROM applications a JOIN workers w ON a.worker_id = w.workerid WHERE a.job_id = $1", [job_id]);
        return res.status(200).json({ applications: result.rows });
    } catch(err) {
        console.error("Error fetching applications by job:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getApplicationsbyWorker = async (req, res) => {
    try {
        const { worker_id } = req.params;
        if (!worker_id || isNaN(worker_id)) {
            return res.status(400).json({ message: "Invalid worker ID" });
        }
        const result = await db.query("SELECT a.*, j.title, j.location FROM applications a JOIN jobs j ON a.job_id = j.jobid WHERE a.worker_id = $1", [worker_id]);
        return res.status(200).json({ applications: result.rows });
    } catch(err) {
        console.error("Error fetching applications by worker:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateApplicationStatus = async (req, res) => {
    try {
        const {id, status} = req.body;
        if (!id || !status || !['accepted', 'pending', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid ID or status" });
        }
        const result = await db.query("UPDATE applications SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
        if(result.rows.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }
        return res.status(200).json({ message: "Application status updated successfully", application: result.rows[0] });
    } catch(err) {
        console.error("Error updating application status:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteApplication = async (req, res) => {
    try {
        const {id}= req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid application ID" });
        }
        const result = await db.query("DELETE FROM applications WHERE id = $1 RETURNING *", [id]);
        if(result.rows.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }
        return res.status(200).json({ message: "Application deleted successfully", application: result.rows[0] });
    } catch(err) {
        console.error("Error deleting application:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
