export default async function handler(req, res) {
  // Enable CORS headers for your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer key_bb600cf9d3cfead9f33fdee3d72e',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent_id: 'agent_b418e2ac9756963a2ec56a1cd1'
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
