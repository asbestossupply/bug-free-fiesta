/**
 * Provider for ip-api.com
 * See https://ip-api.com/docs/api:json
 */

const fetch = require("node-fetch");
const { HourlyLimiter } = require('./hourly_limiter');

const limiter = new HourlyLimiter(5); 
module.exports.getCountryFromIp = async function (ip) {
    limiter.incr();
    const resp = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await resp.json();
    
    if (data.status === 'fail') {
        throw Error(data.message);
    }
    
    return data['country'];
}