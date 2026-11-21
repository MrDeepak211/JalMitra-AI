import http from 'node:http'
import { randomUUID } from 'node:crypto'

const PORT = Number(process.env.PORT || 4000)
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'
const readings = []

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(JSON.stringify(body))
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', chunk => { raw += chunk; if (raw.length > 16_384) reject(new Error('Payload too large')) })
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}) } catch { reject(new Error('Invalid JSON')) }
    })
    req.on('error', reject)
  })
}
const server = http.createServer(async (req, res) => {
  res.setHeader('access-control-allow-origin', ALLOWED_ORIGIN)
  res.setHeader('access-control-allow-methods', 'GET,POST,OPTIONS')
  res.setHeader('access-control-allow-headers', 'content-type,authorization')
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end() }
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
  if (req.method === 'GET' && url.pathname === '/api/health') return send(res, 200, { ok: true, service: 'jalmitra-api', version: '0.1.0', mode: 'prototype' })
  if (req.method === 'GET' && url.pathname === '/api/readings') return send(res, 200, { items: readings.slice(-100), count: readings.length })
  if (req.method === 'POST' && url.pathname === '/api/readings') {
    try {
      const body = await readBody(req)
      if (typeof body.device_id !== 'string' || !/^[A-Za-z0-9_-]{2,40}$/.test(body.device_id)) return send(res, 400, { error: 'device_id is required and must be 2–40 safe characters' })
      if (!Number.isInteger(body.raw_adc) || body.raw_adc < 0 || body.raw_adc > 4095) return send(res, 400, { error: 'raw_adc must be an integer from 0 to 4095' })
      const item = { id: randomUUID(), device_id: body.device_id, plot_id: typeof body.plot_id === 'string' ? body.plot_id.slice(0, 60) : null, sampled_at: typeof body.sampled_at === 'string' ? body.sampled_at : new Date().toISOString(), raw_adc: body.raw_adc, calibrated_vwc_percent: null, calibration_status: 'pending', received_at: new Date().toISOString() }
      readings.push(item)
      if (readings.length > 500) readings.shift()
      return send(res, 201, { accepted: true, reading: item, note: 'Raw ADC stored. No calibrated moisture percentage is inferred until site-specific calibration is completed.' })
    } catch (error) { return send(res, 400, { error: error.message || 'Invalid request' }) }
  }
  if (req.method === 'POST' && url.pathname === '/api/advisory') {
    try {
      const body = await readBody(req)
      return send(res, 200, { status: 'insufficient_data', recommendation: 'Recheck field conditions; no irrigation recommendation can be issued yet.', reasons: ['Crop and growth stage must be configured.', 'Soil-specific sensor calibration is pending.', 'A verified weather feed is not connected.'], plot_id: typeof body.plot_id === 'string' ? body.plot_id : null, advisory_only: true })
    } catch (error) { return send(res, 400, { error: error.message || 'Invalid request' }) }
  }
  return send(res, 404, { error: 'Not found' })
})
server.listen(PORT, '0.0.0.0', () => console.log(`JalMitra API listening on port ${PORT}`))
