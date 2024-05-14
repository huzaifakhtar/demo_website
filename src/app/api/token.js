const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
app.use(express.json());

const appId = 'humaya121';
const secretKey = 'gw9r7%%8VzV9Mc5kM8jnmZPM8ccW!HY9';
const apiUrl = 'https://open.iopgps.com/api/auth';

app.post('/api/token', async (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignature(secretKey, timestamp);

    const requestData = {
      appid: appId,
      time: timestamp,
      signature: signature.toLowerCase()
    };

    console.log('Request Data:', requestData);

    const response = await axios.post(apiUrl, requestData);
    console.log('WanWay API Response:', response.data);

    const { code, accessToken } = response.data;

    if (code === 0) {
      res.json({
        code: 0,
        expiresin: 7200000,
        accessToken: accessToken,
        token_type: "Bearer"
      });
    } else {
      res.status(401).json({
        code: response.data.code,
        result: response.data.result
      });
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      code: 500,
      result: 'Internal server error'
    });
  }
});

function generateSignature(secretKey, timestamp) {
  const hash = crypto.createHash('md5').update(secretKey).digest('hex');
  const signature = crypto.createHash('md5').update(hash + timestamp).digest('hex').toLowerCase();
  return signature;
}

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    code: 500,
    result: 'Internal server error'
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});