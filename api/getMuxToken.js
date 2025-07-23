export default async function handler(req, res) {
  const { playbackId } = req.query;

  if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    return res.status(500).json({ error: 'Missing Mux environment variables.' });
  }

  const response = await fetch(`https://api.mux.com/video/v1/playback-ids/${playbackId}/token`, {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(`${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`).toString('base64'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ttl: 3600, // 1 hour
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json({ error: 'Failed to generate token' });
  }

  const data = await response.json();
  return res.status(200).json({ token: data.token });
}
