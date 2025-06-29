

import db from "../Models/AgroConnectMitr.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { translateText } from "../translate.js";

dotenv.config();

//famrer registration
export const registrationfarmer = async (req, res) => {
    try {
        const {name, email, phone, password, farm_intro, worker_requirement, farm_location} = req.body;
         const existing = await db.query(`select * from farmers where email = $1`, [email]);
         if(existing.rows.length > 0) {
            return res.status(400).json({message:"User already exists"});
         }
         const hashpassword = await bcrypt.hash(password, 10);

         
         const result = await db.query(`insert into farmers (name, email, phone, password, farm_intro, worker_requirement, farm_location) values ($1, $2, $3, $4, $5, $6, $7) returning *`, [name, email, phone, hashpassword, farm_intro, worker_requirement, farm_location]);
         return res.status(200).json({message:"User registered successfully", farmer: result.rows[0]});
    }catch(err){
        console.error("registrationfarmer error:", err);
        return res.status(500).json({message:"Internal server error"})
    }
    }

//farmer login
export const loginfarmer = async (req,res) => {
    try{
        const {email, password} = req.body;
        const result = await db.query(`select * from farmers where email = $1`, [email]);
        const farmer = result.rows[0];
        if(!farmer){
            return res.status(400).json({message:"User not found"});
        }
        const isMatch = await bcrypt.compare(password,farmer.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid password"});
        }
         const token = jwt.sign({farmerid: farmer.farmerid, role: "farmer"},process.env.AGROCONNECTMITR_SECRET, {expiresIn: '100d'});
         return res.status(200).json({message: "User loging successful", token, farmer:{
            farmerid:farmer.farmerid,
            name: farmer.name,
            email: farmer.email,
            phone: farmer.phone,
            farm_intro: farmer.farm_intro,
            worker_requirement: farmer.worker_requirement,
            farm_location: farmer.farm_location      
         }});
    } catch(err) {
        console.error("Loginuser error:", err);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const getAllfarmers = async (req,res) => {
    try {
        const result = await db.query(`select farmerid, name, farm_intro, worker_requirement, farm_location from farmers`);
        return res.status(200).json({message:"All farmers fetched successfully", farmers: result.rows});
    }catch(err) {
        console.error("getAllfarmers error:", err);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const getfarmerById = async (req, res) => {
    try {
        const {farmerid} =  req.params;
        const result = await db.query(`select farmerid, name, farm_intro, worker_requirement, farm_location from farmers where farmerid = $1`, [farmerid]);
        if(result.rows.length === 0){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({message:"Farmer fetched successfully", farmer: result.rows[0]});
    }catch(err) {
        console.error("getfarmerById error:", err);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const getfarmerByLocation = async (req,res) => {
    try {
        const {location} = req.params;
        const result = await db.query(`select farmerid, name, farm_intro, worker_requirement, farm_location from farmers where farm_location ILIKE $1`, [`%${location}%`]);
        return res.status(200).json({message:"Farmers fetched successfully", farmers: result.rows});
    }catch(err) {
        console.error("getfarmerByLocation error:", err);
        return res.status(500).json({message:"Internal server error"});
    }
}


export const translateFarmIntro = async (req, res) => {
  try {
    const { farmerid, lang } = req.params; // lang = 'hi' or 'mr'

    const result = await db.query("SELECT farm_intro FROM farmers WHERE farmerid = $1", [farmerid]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    const originalIntro = result.rows[0].farm_intro;
    const translated = await translateText(originalIntro, lang);

    res.json({
      farmerid,
      original: originalIntro,
      translated: translated,
      language: lang
    });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ message: "Translation failed" });
  }
};
