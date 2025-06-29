
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import db from "../Models/AgroConnectMitr.js"

dotenv.config();

export const registerWorker = async (req,res) => {
    try {
        const { workerid ,name ,email ,phone , password , skills_ofworker , capacity_ofworker , wage_per_day_ofworker , wage_per_month_ofworker} = req.body;
        const existing = await db.query("select * from workers where email = $1", [email]);
        if(existing.rows.length > 0) {
            return res.status(400).json({message: "User already exists"})
        }
        const hashpassword = await bcrypt.hash(password, 10);
        const result = await db.query(`insert into workers (name, email, phone, password, skills_ofworker, capacity_ofworker, wage_per_day_ofworker, wage_per_month_ofworker) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *`, [name, email, phone, hashpassword, skills_ofworker, capacity_ofworker, wage_per_day_ofworker, wage_per_month_ofworker]);
        return res.status(200).json({message: "User registered successfully", Worker: result.rows[0]})
    }catch(err) {
        console.error("registerWorker error:", err);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const loginWorker = async (req, res) => {
    try {
        const {email, password} = req.body;
        const result = await db.query ("select * from workers where email = $1", [email]);
        const worker = result.rows[0];
        if(!worker) {
            return res.status(400).json({message: "User not found"});
        }
        const isMatch = await bcrypt.compare(password, worker.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid password"})
        }
        const token = jwt.sign({workerid:worker.workerid , role: "worker"},process.env.AGROCONNECTMITR_SECRET, {expiresIn: '100d'});
        return res.status(200).json({message: "User login successful", token, worker: {
            workerid: worker.workerid,
            name: worker.name,
            email: worker.email,
            phone: worker.phone,
            password: worker.password,
            skills_ofworker: worker.skills_ofworker,
            capacity_ofworker: worker.capacity_ofworker,
            wage_per_day_ofworker: worker.wage_per_day_ofworker,
            wage_per_month_ofworker: worker.wage_per_month_ofworker,
        }
        })
    }catch(err) {
        console.error("loginWorker error:", err);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const getAllWorkers = async (req, res) => {
    try {
        const result = await db.query("select workerid, name, skills_ofworker, capacity_ofworker, wage_per_day_ofworker, wage_per_month_ofworker from workers");
        return res.status(200).json({message: "All workers fetched successfully", workers: result.rows});
    }catch(err) {
        console.error("getAllWorkers error:", err);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const getWorkerById = async (req, res) => {
    try {
        const { workerid } = req.params;
        const result = await db.query("select * from workers where workerid = $1", [workerid]);
        if(result.rows.length === 0) {
            return res.status(404).json({message: "Worker not found"});
        }
        return res.status(200).json({message: "Worker fetched successfully", worker: result.rows[0]});
    }catch(err) {
        console.error("getWorkerById error:", err);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const getWorkersBySkill = async (req, res) => {
  try {
    const { skill } = req.params;
    const result = await db.query(
      `SELECT workerid, name, email, phone,skills_ofworker, capacity_ofworker, wage_per_day_ofworker, wage_per_month_ofworker
       FROM workers WHERE skills_ofworker ILIKE $1`,
      [`%${skill}%`]
    );
    return res.status(200).json({ workers: result.rows });
  } catch (err) {
    console.error("getWorkersBySkill error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

