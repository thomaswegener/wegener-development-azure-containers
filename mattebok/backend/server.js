require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Pool } = require('pg')

const app = express()
const PORT = 3001

app.use(cors())
app.use(bodyParser.json())

// 📦 PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// 🔐 Middleware for protecting routes
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('⛔️ Ugyldig/manglende Authorization-header')
    return res.status(401).json({ error: 'Mangler eller ugyldig token' })
  }

  try {
    const token = authHeader.split(' ')[1]
    console.log('🔐 Verifiserer token med JWT_SECRET:', process.env.JWT_SECRET)
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    console.error('❌ Token verification failed:', err.message)
    return res.status(401).json({ error: 'Ugyldig token' })
  }
}

// 🔐 POST: Logg inn
app.post('/login', async (req, res) => {
  const { navn, passord } = req.body

  try {
    console.log('🔐 Innloggingsforsøk:', navn)

    const result = await pool.query('SELECT * FROM users WHERE username = $1', [navn])
    const bruker = result.rows[0]

    if (!bruker) {
      console.log('❌ Bruker ikke funnet')
      return res.status(401).json({ error: 'Feil brukernavn eller passord' })
    }

    const passordOk = await bcrypt.compare(passord, bruker.password_hash)

    if (!passordOk) {
      console.log('❌ Feil passord for', navn)
      return res.status(401).json({ error: 'Feil brukernavn eller passord' })
    }

    console.log('🔑 JWT_SECRET brukt i signering:', process.env.JWT_SECRET)

    const token = jwt.sign(
      { id: bruker.id, navn: bruker.username, rolle: bruker.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log('✅ Token generert for', navn, '→', token ? '[OK]' : '[FEIL]')

    res.json({ token, navn: bruker.username, rolle: bruker.role })
  } catch (error) {
    console.error('❌ Feil i login-handler:', error)
    res.status(500).json({ error: 'Noe gikk galt' })
  }
})

// ➕ POST: Registrer ny bruker
app.post('/registrer', async (req, res) => {
  const { navn, passord } = req.body

  try {
    const hashedPassword = await bcrypt.hash(passord, 10)

    const result = await pool.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [navn, hashedPassword, navn === 'thomas' ? 'admin' : 'elev']
    )

    const user = result.rows[0]

    const token = jwt.sign(
      { id: user.id, navn: user.username, rolle: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log('🆕 Ny bruker registrert:', user.username)

    res.status(201).json({ token, navn: user.username, rolle: user.role })
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'Brukernavn finnes fra før' })
    } else {
      console.error(error)
      res.status(500).json({ error: 'Noe gikk galt' })
    }
  }
})

app.get('/bruker/:navn/fremgang', authMiddleware, async (req, res) => {
  console.log('📥 Forespørsel om fremgang for:', req.params.navn)
  console.log('🔑 Verifisert token, payload:', req.user)

  if (req.user.navn !== req.params.navn && req.user.rolle !== 'admin') {
    console.log('🚫 Token-navn stemmer ikke med param')
    return res.status(403).json({ error: 'Ingen tilgang' })
  }

  try {
    const brukerResult = await pool.query('SELECT id FROM users WHERE username = $1', [req.params.navn])
    console.log('🧑 Bruker-resultat:', brukerResult.rows)

    if (brukerResult.rowCount === 0) {
      console.log('❌ Bruker ikke funnet i databasen')
      return res.status(404).json({ error: 'Bruker ikke funnet' })
    }

    const brukerId = brukerResult.rows[0].id
    console.log('🔍 Bruker-ID:', brukerId)

    const result = await pool.query(
    'SELECT task_id, answer FROM user_progress WHERE user_id = $1',
    [brukerId]
    )

console.log('📊 Fremgang-resultat:', result.rows)
const progress = {}
result.rows.forEach((row) => {
  progress[row.task_id] = row.answer
})

    

    

    console.log('✅ Returnerer fremgang:', progress)
    res.json(progress)
  } catch (error) {
    console.error('❌ FULL FEIL VED FREMHENTING:', error)
    res.status(500).json({ error: 'Feil ved henting av fremgang' })
  }
})

// 💾 POST: Lagre fremgang (beskyttet)
app.post('/bruker/:navn/fremgang', authMiddleware, async (req, res) => {
  if (req.user.navn !== req.params.navn) {
    return res.status(403).json({ error: 'Ingen tilgang' })
  }

  const { id, svar } = req.body

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [req.params.navn])
    if (userResult.rowCount === 0) return res.status(404).json({ error: 'Bruker ikke funnet' })

    const userId = userResult.rows[0].id

    await pool.query(
      `INSERT INTO user_progress (user_id, task_id, answer)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, task_id)
      DO UPDATE SET answer = $3`,
      [userId, id, svar]
    )

    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Feil ved lagring av fremgang' })
  }
})

// 🔐 Admin: hent alle brukere
app.get('/brukere', authMiddleware, async (req, res) => {
  try {
    if (req.user.rolle !== 'admin') {
      return res.status(403).json({ error: 'Ingen tilgang' })
    }

    const brukerResult = await pool.query('SELECT id, username, role FROM users ORDER BY username')
    const brukere = brukerResult.rows

    const alleBrukere = {}

    for (const bruker of brukere) {
      const fremgangResult = await pool.query(
        'SELECT task_id, answer FROM user_progress WHERE user_id = $1',
        [bruker.id]
      )

      const fremgang = {}
      fremgangResult.rows.forEach((row) => {
        fremgang[row.task_id] = row.answer
      })

      alleBrukere[bruker.username] = {
        id: bruker.id,
        rolle: bruker.role,
        fremgang
      }
    }

    res.json(alleBrukere)
  } catch (error) {
    console.error('❌ Feil ved henting av brukere:', error)
    res.status(500).json({ error: 'Feil ved henting av brukere' })
  }
})
app.put('/admin/rolle', authMiddleware, async (req, res) => {
  if (req.user.rolle !== 'admin') {
    return res.status(403).json({ error: 'Ingen tilgang' })
  }

  const { navn, rolle } = req.body

  if (!navn || !rolle) {
    return res.status(400).json({ error: 'Mangler brukernavn eller rolle' })
  }

  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE username = $2 RETURNING id, username, role',
      [rolle, navn]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Bruker ikke funnet' })
    }

    console.log(`🛠 Rolle oppdatert: ${navn} → ${rolle}`)
    res.json({ success: true, bruker: result.rows[0] })
  } catch (err) {
    console.error('❌ Feil ved oppdatering av rolle:', err)
    res.status(500).json({ error: 'Feil ved oppdatering av rolle' })
  }
})
// 🚀 Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server kjører på http://localhost:${PORT}`)
})
