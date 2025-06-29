import db from "../Models/AgroConnectMitr.js";



export const createJob = async (req, res) => {
    try {
        const {farmer_id, title, description, location, wage, required_skills} = req.body;
        if (!farmer_id || isNaN(farmer_id)) {
            return res.status(400).json({message: "Invalid or missing farmer ID"});
        }
        const farmerCheck = await db.query("SELECT * FROM farmers WHERE farmerid = $1", [farmer_id]);
        if (farmerCheck.rows.length === 0) {
            return res.status(404).json({message: "Farmer not found"});
        }
        const result = await db.query(`insert into jobs (farmer_id, title, description, location, wage, required_skills, posted_at) values($1, $2, $3, $4, $5, $6, NOW()) returning *`, [farmer_id, title, description, location, wage, required_skills]);
        return res.status(201).json({message: "Job created successfully", job: result.rows[0]});
    } catch (error) {
        console.error("Error creating job:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

//for getting all jobs
export const getAllJobs = async (req, res) => {
    try {
        const result = await db.query ("select * from jobs order by posted_at desc");
        return res.status(200).json({message: "All jobs you requested", jobs: result.rows});
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

//job by id
export const getJobById = async (req, res) => {
    try {
        const {jobid} = req.params;
        const result = await db.query("select * from jobs where jobid = $1", [jobid]);
            if (result.rows.length === 0) {
                return res.status(404).json({message: "Your requested job not found"});
            }
            return res.status(200).json({message: "Job fetched successfully", job: result.rows[0]});
    } catch (error) {
        console.error("Error fetching job:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

//update job
export const updateJob = async (req, res) => {
    try {
        const {jobid} = req.params;
        const {title, description, location, wage, required_skills}= req.body;
        const result = await db.query("update jobs set title = $1, description = $2, location = $3, wage = $4, required_skills = $5 where jobid = $6 returning *", [title, description, location, wage, required_skills, jobid]);
        if (result.rows.length === 0) {
            return res.status(404).json({message: "job not found"});
        }
        return res.status(200).json({message: "job updated successfully", job: result.rows[0]});
    } catch (error) {
        console.error("Error updating job:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

// delete job
export const deleteJob = async (req,res)=>{
    try{
        const {jobid} = req.params;
        const result = await db.query("delete from jobs where jobid= $1 returning *", [jobid]);
        if(result.rows.length === 0) {
            return res.status(404).json({message: "Job not found"});
        }
        return res.status(200).json({message: "Job deleted successfully", job: result.rows[0]});
    }catch (error) {
        console.error("Error deleting job:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const getPublicJobs = async (req, res) => {
     try {
        const result = await db.query(`
  SELECT 
    j.jobid, j.title, j.description, j.location, j.wage, j.required_skills,
    f.name AS farmer_name, f.farm_location, j.posted_at
  FROM jobs j
  JOIN farmers f ON j.farmer_id = f.farmerid
  ORDER BY j.posted_at DESC
`);
        return res.status(200).json({ message: "Public jobs fetched", jobs: result.rows });
    } catch (error) {
        console.error("Error fetching public jobs:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
