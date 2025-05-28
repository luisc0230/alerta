// netlify/functions/alert.js

// Estado global en memoria
let active = false
let currentMessage = ''

// Cabeceras CORS
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

exports.handler = async (event) => {
  // Responder a preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
    }
  }

  // GET → devuelve el estado de la alerta
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        active,
        message: currentMessage
      }),
    }
  }

  // POST → { action: 'send'|'remove', message? }
  if (event.httpMethod === 'POST') {
    try {
      const { action, message } = JSON.parse(event.body || '{}')

      if (action === 'send') {
        active = true
        currentMessage = message || ''
      } else if (action === 'remove') {
        active = false
        currentMessage = ''
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      }
    } catch (err) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON' }),
      }
    }
  }

  // Métodos no permitidos
  return {
    statusCode: 405,
    headers,
    body: 'Method Not Allowed',
  }
}
