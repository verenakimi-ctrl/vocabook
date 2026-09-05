export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let paymentId = req.body?.paymentId;
  if (!paymentId && typeof req.body === 'string') {
    try { paymentId = JSON.parse(req.body).paymentId; } catch (e) {}
  }

  const apiKey = process.env.PI_API_KEY ? process.env.PI_API_KEY.trim() : null;

  if (!apiKey) {
    console.error("오류: PI_API_KEY 환경변수가 설정되지 않았습니다.");
    return res.status(500).json({ error: "API Key missing on Vercel" });
  }

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log("파이 서버 응답 결과:", response.status, data);
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("fetch 실패:", error);
    return res.status(500).json({ error: error.message });
  }
}

