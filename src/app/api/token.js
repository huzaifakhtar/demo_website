const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
app.use(express.json());

const appId = 'humaya121';
const secretKey = 'WYpkNrZfmR%3JuQ4UZQZ7@3wKe4DZaxn';
const apiUrl = 'https://open.iopgps.com/api/auth';

app.post('/api/token', async (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignature(secretKey, timestamp);

    const requestData = {
      appid: appId,
      time: timestamp,
      signature: signature
    };

    const response = await axios.post(apiUrl, requestData);
    const { code, accessToken } = response.data;

    if (code === 0) {
      res.json({ token: accessToken });
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function generateSignature(secretKey, timestamp) {
  const md5 = crypto.createHash('md5');
  const hash = md5.update(secretKey).digest('hex');
  const signature = md5.update(hash + timestamp).digest('hex');
  return signature;
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});