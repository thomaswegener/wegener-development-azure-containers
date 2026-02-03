const fs = require('fs')
const { Pool } = require('pg')
require('dotenv').config()

const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'))
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const migrate = async () => {
  for (const [username, data] of Object.entries(db.brukere)) {
    if (!username || !data.fremgang) continue

    try {
      const userRes = await pool.query('SELECT id FROM users WHERE username = $1', [username])
      const user = userRes.rows[0]
      if (!user) {
        console.warn(`User not found in DB: ${username}`)
        continue
      }

      const userId = user.id

      for (const [taskId, answer] of Object.entries(data.fremgang)) {
        await pool.query(
          `INSERT INTO user_progress (user_id, task_id, answer)
           VALUES ($1, $2, $3)
           ON CONFLICT (user_id, task_id) DO NOTHING`,
          [userId, taskId, answer]
        )
      }

      console.log(`✅ Fremgang imported for ${username}`)
    } catch (err) {
      console.error(`❌ Error for user ${username}:`, err.message)
    }
  }

  await pool.end()
}

migrate()
