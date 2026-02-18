import postgres from 'postgres'
import 'dotenv/config'

// Check if the variable is actually loading
if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not defined! Check if your .env file is in the root folder.");
}

const connectionString = process.env.DATABASE_URL

const sql = postgres(connectionString, {
    /* Supabase Tip: If using the Transaction Pooler (port 6543), 
       set prepare: false to avoid errors with prepared statements.
    */
    prepare: false, 
    ssl: 'require' // Supabase requires SSL for security
})

export default sql