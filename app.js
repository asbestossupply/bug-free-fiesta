const express = require('express');
const { is_valid_ip } = require('./lib/ip_parser');
const { getCountryFromIp } = require('./lib/ip_searcher');

const app = express();
app.use(express.json());

// respond with "hello world" when a GET request is made to the homepage
app.post('/', async (req, res) => {
  if (!is_valid_ip(req.body.ip)) {
    return res.status(400).json({ success: false, error: 'bad ip address' });
  }

  try {
    const country = await getCountryFromIp(req.body.ip);

    console.log(`done: ${country}`)
    res.status(200).json({ success: true, result: country });
  } catch (err) {
    console.log(err);
    const error = err.toString() || 'error fetching, try again?'
    res.status(500).json({ success: false, error })
  }

})
module.exports = app;