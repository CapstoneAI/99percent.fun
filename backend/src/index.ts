import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { pool } from './db'
import { uploadImage } from './cloudinary'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))


// POST /migrate — crea tabelle
app.get('/migrate', async (_, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tokens (
        id SERIAL PRIMARY KEY,
        name VARCHAR(64) NOT NULL,
        ticker VARCHAR(16) NOT NULL,
        contract_address VARCHAR(64) UNIQUE,
        creator_wallet VARCHAR(64) NOT NULL,
        type VARCHAR(8) NOT NULL CHECK (type IN ('human', 'agent')),
        description TEXT,
        image_url TEXT,
        twitter_url TEXT,
        telegram_url TEXT,
        agent_name TEXT,
        proof_url TEXT,
        website_url TEXT,
        volume_usd DECIMAL DEFAULT 0,
        market_cap DECIMAL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        is_daily_pick BOOLEAN DEFAULT FALSE,
        daily_pick_date DATE
      )
    `)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        token_address VARCHAR(64) NOT NULL,
        wallet VARCHAR(64) NOT NULL,
        content TEXT NOT NULL,
        likes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    res.json({ ok: true, message: 'Tables created' })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

// DELETE /admin/tokens/:id — temp admin endpoint
app.delete('/admin/tokens/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tokens WHERE id = $1', [req.params.id])
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'DB error' })
  }
})

// Migrate agent columns
app.get('/migrate-agent', async (req, res) => {
  try {
    await pool.query('ALTER TABLE tokens ADD COLUMN IF NOT EXISTS agent_name TEXT')
    await pool.query('ALTER TABLE tokens ADD COLUMN IF NOT EXISTS proof_url TEXT')
    res.json({ ok: true, message: 'Columns added' })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok' }))

// GET /api/tokens — feed con filtri
app.get('/api/tokens', async (req, res) => {
  const { filter = 'new', type } = req.query
  try {
    let orderBy = 'created_at DESC'
    if (filter === 'trending') orderBy = 'volume_usd DESC'
    if (filter === 'mcap') orderBy = 'market_cap DESC'

    const typeFilter = type ? `WHERE type = $1` : ''
    const values = type ? [type] : []

    const result = await pool.query(
      `SELECT * FROM tokens ${typeFilter} ORDER BY ${orderBy} LIMIT 50`,
      values
    )
    res.json({ tokens: result.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'DB error' })
  }
})

// POST /api/tokens — crea token
app.post('/api/tokens', async (req, res) => {
    const { name, ticker, creator_wallet, type, description, image_url, twitter_url, telegram_url, website_url, contract_address, agent_name, proof_url } = req.body as { name: string, ticker: string, creator_wallet: string, type: string, description?: string, image_url?: string, twitter_url?: string, telegram_url?: string, website_url?: string, contract_address?: string, agent_name?: string, proof_url?: string }
  if (!name || !ticker || !creator_wallet || !type) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  try {
    let finalImageUrl = image_url || null
    if (image_url && image_url.startsWith('data:')) {
      try {
        finalImageUrl = await uploadImage(image_url)
      } catch (e) {
        console.error('Image upload failed:', e)
        finalImageUrl = null
      }
    }
    const result = await pool.query(
      `INSERT INTO tokens (name, ticker, creator_wallet, type, description, image_url, twitter_url, telegram_url, website_url, contract_address, agent_name, proof_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [name, ticker, creator_wallet, type, description, finalImageUrl, twitter_url, telegram_url, website_url, contract_address, agent_name || null, proof_url || null]
    )
    res.status(201).json({ token: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'DB error' })
  }
})

// GET /api/tokens/:address
app.get('/api/tokens/:address', async (req, res) => {
  try {
    const addr = req.params.address
    const isId = /^\d+$/.test(addr)
    const result = await pool.query(
      isId ? 'SELECT * FROM tokens WHERE id = $1' : 'SELECT * FROM tokens WHERE contract_address = $1',
      [addr]
    )
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' })
    res.json({ token: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'DB error' })
  }
})

// GET /api/stats
app.get('/api/stats', async (_, res) => {
  try {
    const [tokens, volume, humans, agents] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM tokens'),
      pool.query('SELECT COALESCE(SUM(volume_usd),0) as total FROM tokens'),
      pool.query("SELECT COUNT(*) FROM tokens WHERE type='human'"),
      pool.query("SELECT COUNT(*) FROM tokens WHERE type='agent'"),
    ])
    res.json({
      total_tokens: parseInt(tokens.rows[0].count),
      total_volume: parseFloat(volume.rows[0].total),
      human_tokens: parseInt(humans.rows[0].count),
      agent_tokens: parseInt(agents.rows[0].count),
    })
  } catch (err) {
    res.status(500).json({ error: 'DB error' })
  }
})

// GET /api/daily-pick
app.get('/api/daily-pick', async (_, res) => {
  const today = new Date().toISOString().slice(0,10)
  try {
    let result = await pool.query(
      'SELECT * FROM tokens WHERE daily_pick_date = $1', [today]
    )
    if (!result.rows.length) {
      // Scegli random tra i token con più volume
      result = await pool.query(
        'SELECT * FROM tokens ORDER BY RANDOM() LIMIT 1'
      )
      if (result.rows.length) {
        await pool.query(
          'UPDATE tokens SET is_daily_pick=TRUE, daily_pick_date=$1 WHERE id=$2',
          [today, result.rows[0].id]
        )
      }
    }
    res.json({ token: result.rows[0] || null })
  } catch (err) {
    res.status(500).json({ error: 'DB error' })
  }
})

// POST /api/comments
app.post('/api/comments', async (req, res) => {
  const { token_address, wallet, content } = req.body
  if (!token_address || !wallet || !content) {
    return res.status(400).json({ error: 'Missing fields' })
  }
  try {
    const result = await pool.query(
      'INSERT INTO comments (token_address, wallet, content) VALUES ($1,$2,$3) RETURNING *',
      [token_address, wallet, content]
    )
    res.status(201).json({ comment: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'DB error' })
  }
})

// GET /api/comments/:address
app.get('/api/comments/:address', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM comments WHERE token_address=$1 ORDER BY created_at DESC',
      [req.params.address]
    )
    res.json({ comments: result.rows })
  } catch (err) {
    res.status(500).json({ error: 'DB error' })
  }
})


app.get('/api/leaderboard', async (req: express.Request, res: express.Response) => {
  try {
    const sql = "SELECT agent_name, COUNT(*) as token_count, COALESCE(SUM(volume_usd), 0) as total_volume, (SELECT name FROM tokens t2 WHERE t2.agent_name = t1.agent_name ORDER BY volume_usd DESC NULLS LAST LIMIT 1) as top_token_name, (SELECT ticker FROM tokens t2 WHERE t2.agent_name = t1.agent_name ORDER BY volume_usd DESC NULLS LAST LIMIT 1) as top_token_ticker, (SELECT COALESCE(volume_usd, 0) FROM tokens t2 WHERE t2.agent_name = t1.agent_name ORDER BY volume_usd DESC NULLS LAST LIMIT 1) as top_token_volume FROM tokens t1 WHERE type = 'agent' AND agent_name IS NOT NULL AND agent_name != '' GROUP BY agent_name ORDER BY total_volume DESC LIMIT 10"
    const result = await pool.query(sql)
    res.json({
      leaderboard: result.rows.map((row: any) => ({
        agent_name: row.agent_name,
        token_count: parseInt(row.token_count),
        total_volume: parseFloat(row.total_volume),
        top_token_name: row.top_token_name,
        top_token_ticker: row.top_token_ticker,
        top_token_volume: parseFloat(row.top_token_volume || 0),
      }))
    })
  } catch (err) {
    console.error('Leaderboard error:', err)
    res.status(500).json({ error: 'Failed to fetch leaderboard' })
  }
})


// Update token image
app.patch('/api/tokens/:id', async (req, res) => {
  const { id } = req.params
  const { image_url } = req.body
  try {
    const result = await pool.query(
      'UPDATE tokens SET image_url = $1 WHERE id = $2 RETURNING *',
      [image_url, id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Update failed' })
  }
})


// Upload image to Cloudinary
app.post('/api/upload-image', async (req: any, res: any) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });
    const url = await uploadImage(image);
    return res.json({ url });
  } catch (err: any) {
    console.error('Cloudinary upload error:', err);
    return res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
