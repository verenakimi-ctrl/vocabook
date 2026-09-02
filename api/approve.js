
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // body가 문자열로 올 경우 대비
  let paymentId = req.body?.paymentId;
  if (!paymentId && typeof req.body === 'string') {
    try {
      paymentId = JSON.parse(req.body).paymentId;
    } catch (e) {}
  }

  const apiKey = process.env.PI_API_KEY;

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log("Pi Approve Result:", data);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Approve Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
