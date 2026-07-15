import { useState } from 'react'

function App() {
  const [features, setFeatures] = useState('')
  const [threshold, setThreshold] = useState(0.3)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePredict = async () => {
    setError(null)
    setResult(null)
    setLoading(true)

    try {
      const parsed = features.split(',').map(v => parseFloat(v.trim()))

      if (parsed.length !== 30 || parsed.some(isNaN)) {
        setError(`Expected 30 numeric values, got ${parsed.length}`)
        setLoading(false)
        return
      }

      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: parsed, threshold })
      })

      const data = await res.json()
      if (data.error) setError(data.error)
      else setResult(data)
    } catch (e) {
      setError('Could not reach the API. Is uvicorn running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', padding: 20 }}>
      <h1>Fraud Detection</h1>
      <p style={{ color: '#666' }}>
        Paste 30 comma-separated transaction features (Time, V1–V28, Amount).
      </p>

      <textarea
        value={features}
        onChange={e => setFeatures(e.target.value)}
        rows={5}
        style={{ width: '100%', fontFamily: 'monospace', fontSize: 12 }}
        placeholder="160760.0, -0.674, 1.408, ..."
      />

      <div style={{ margin: '20px 0' }}>
        <label>
          Decision threshold: <strong>{threshold}</strong>
        </label>
        <input
          type="range"
          min="0" max="1" step="0.05"
          value={threshold}
          onChange={e => setThreshold(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
        <small style={{ color: '#666' }}>
          Lower = catch more fraud, more false alarms. Higher = fewer false alarms, miss more fraud.
        </small>
      </div>

      <button onClick={handlePredict} disabled={loading} style={{ padding: '10px 20px' }}>
        {loading ? 'Predicting...' : 'Predict'}
      </button>

      {error && (
        <div style={{ marginTop: 20, padding: 15, background: '#fee', borderRadius: 4 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{
          marginTop: 20, padding: 20, borderRadius: 4,
          background: result.flagged ? '#fee' : '#efe',
          border: `2px solid ${result.flagged ? '#c00' : '#0a0'}`
        }}>
          <h2 style={{ margin: 0 }}>
            {result.flagged ? '⚠️ Flagged as fraud' : '✓ Legitimate'}
          </h2>
          <p style={{ fontSize: 24, margin: '10px 0' }}>
            Fraud probability: <strong>{(result.fraud_probability * 100).toFixed(2)}%</strong>
          </p>
          <small style={{ color: '#666' }}>Threshold: {result.threshold}</small>
        </div>
      )}
    </div>
  )
}

export default App