/**
 * Provider for ipapi.co
 * See https://ipapi.co/#api
 */

const fetch = require("node-fetch");
const { HourlyLimiter } = require('./hourly_limiter');

const limiter = new HourlyLimiter(5); 
module.exports.getCountryFromIp = async function (ip) {
    limiter.incr();
    const resp = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await resp.json();
    
    if (data.error) {
        throw Error(data.reason);
    }
    
    return data['country_name'];
}