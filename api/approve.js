export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let paymentId = req.body?.paymentId;
  if (!paymentId && typeof req.body === 'string') {
    try {
      paymentId = JSON.parse(req.body).paymentId;
    } catch (e) {}
  }

  const apiKey = (process.env.PI_API_KEY || '').trim();

  if (!apiKey) {
    return res.status(500).json({ error: 'PI_API_KEY is not set' });
  }

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


