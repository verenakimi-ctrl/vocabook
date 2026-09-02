export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {}
  }

  const paymentId = body?.paymentId;
  const txid = body?.txid;
  const apiKey = process.env.PI_API_KEY;

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ txid })
    });

    const data = await response.json();
    console.log("Pi Complete Result:", data);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Complete Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
