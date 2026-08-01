import bcrypt from "bcryptjs"
import { pool } from "./database.js"
import "./dotenv.js"

// Reads the initial administrator details from environment variables.
const {
    ADMIN_USERNAME,
    ADMIN_FIRST_NAME,
    ADMIN_LAST_NAME,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
} = process.env

const requiredValues = {
    ADMIN_USERNAME,
    ADMIN_FIRST_NAME,
    ADMIN_LAST_NAME,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
}

// Stops before accessing the database when required values are missing.
const missingNames = Object.entries(requiredValues)
    .filter(([, value]) => !value?.trim())
    .map(([name]) => name)
if (missingNames.length > 0) {
    throw new Error(`Missing administration environment variables: ${missingNames.join(",")}`)
}    

async function seedAdmin() {
    try {
        // Hashes the password so plaintext is never stored.
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)

        // Creates the admin or safely updates the existing account by email.
        const query = `
            INSERT INTO Users (
                username,
                first_name,
                last_name,
                email,
                password_hash,
                role
                )
            VALUES ($1, $2, $3, $4, $5, 'admin')
            ON CONFLICT (email)
            DO UPDATE SET
                username = EXCLUDED.username,
                first_name = EXCLUDED.first_name,
                last_name = EXCLUDED.last_name,
                password_hash = EXCLUDED.password_hash,
                role = 'admin'
            RETURNING
                user_id,
                username,
                first_name,
                last_name,
                email,
                role
        `

        const values = [
            ADMIN_USERNAME.trim(),
            ADMIN_FIRST_NAME.trim(),
            ADMIN_LAST_NAME.trim(),
            ADMIN_EMAIL.trim().toLowerCase(),
            passwordHash,
]
        const result = await pool.query(query, values)
        console.log(`Administrator ready: ${result.rows[0].email}`)
    }
    catch(error) {
        console.error("Error seeding admin user:", error.message)
        process.exitCode = 1
    } finally {
        // Closes the connection pool so the one-time script can exit.
        await pool.end()
    }
}

seedAdmin()
