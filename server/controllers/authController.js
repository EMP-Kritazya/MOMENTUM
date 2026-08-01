import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { pool } from "../config/database.js"
import "../config/dotenv.js"

// Authenticates an administrator and returns a short-lived JWT.
export async function loginAdmin(req, res) {
    // Normalizes credentials received from the login form.
    const email = req.body.email?.trim().toLowerCase()
    const password = req.body.password?.trim()

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }
    try {
        // Retrieves the account and password hash by unique email.
        const result = await pool.query(
            `
            SELECT
                user_id,
                username,
                first_name,
                last_name,
                email,
                password_hash,
                role
            FROM Users
            WHERE email = $1
            LIMIT 1;
        `,
            [email]
        )
        
        const user = result.rows[0]
        // Safely compares the submitted password with the stored hash.
        const passwordMatch = user?.password_hash && (await bcrypt.compare(password, user.password_hash))
        if (!user || !passwordMatch || user.role !== "admin") {
            return res.status(401).json({ message: "Invalid admincredentials" })
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured.")
        }

        // Signs the user's ID and role for protected admin routes.
        const token = jwt.sign(
            {
                userId: user.user_id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )
        return res.status(200).json({
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
            },
        })
    }
    catch(error) {
        console.error("Unable to authenticate admin:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}
