/**
 * Provider for ip-api.com
 * See https://ip-api.com/docs/api:json
 */

const fetch = require("node-fetch");

module.exports.getCountryFromIp = async function (ip) {
    const resp = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await resp.json();
    
    if (data.status === 'fail') {
        throw Error(data.message);
    }
    
    return data['country'];
}