import db from "../Models/AgroConnectMitr.js";
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const updateUPI = async (req, res) => {
    try {
        const { user_id, upi_id } = req.body;
        if (!user_id || !upi_id) {
            return res.status(400).json({ message: "Invalid user ID or UPI ID" });
        }
        // Determine user role and table based on user_id (simplified logic)
        const role = req.user.role; // Assumes verifyAuth sets req.user
        const table = role === 'farmer' ? 'farmers' : 'workers';
        const query = `UPDATE ${table} SET upi_id = $1 WHERE ${role === 'farmer' ? 'farmerid' : 'workerid'} = $2 RETURNING *`;
        const result = await db.query(query, [upi_id, user_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "UPI updated successfully", user: result.rows[0] });
    } catch (err) {
        console.error("Error updating UPI:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUPI = async (req, res) => {
    try {
        const { user_id } = req.params;
        if (!user_id || isNaN(user_id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        // Determine user role and table based on user_id (simplified logic)
        const role = req.user.role; // Assumes verifyAuth sets req.user
        const table = role === 'farmer' ? 'farmers' : 'workers';
        const idField = role === 'farmer' ? 'farmerid' : 'workerid';
        const result = await db.query(`SELECT upi_id FROM ${table} WHERE ${idField} = $1`, [user_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ upi_id: result.rows[0].upi_id });
    } catch (err) {
        console.error("Error fetching UPI:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const uploadScreenshot = [
    upload.single('screenshot'),
    async (req, res) => {
        try {
            const { user_id, target_id } = req.body;
            if (!user_id || !target_id || isNaN(user_id) || isNaN(target_id)) {
                return res.status(400).json({ message: "Invalid user or target ID" });
            }
            const imageData = req.file.buffer.toString('base64');
            const result = await db.query(
                "INSERT INTO screenshots (user_id, target_id, image_data) VALUES ($1, $2, $3) RETURNING *",
                [user_id, target_id, imageData]
            );
            return res.status(201).json({ message: "Screenshot uploaded successfully", screenshot: result.rows[0] });
        } catch (err) {
            console.error("Error uploading screenshot:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
];