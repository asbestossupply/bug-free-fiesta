const providers = require('./ip_vendors');
const cache = require('./cache');

module.exports.getCountryFromIp = async function(ip) {
    if (cache[ip]) {
        console.log('cache hit');
        return cache[ip];
    }

    console.log('cache miss...');
    for (providerName of Object.keys(providers)) {
        console.log(`querying ${providerName}`);
        
        const p = providers[providerName];

        try {
            const country = await p.getCountryFromIp(ip);
            cache[ip] = country;
            return country;
        } catch(err) {
            console.log(`error querying ${providerName}: ${err}`);
        }
    }

    throw Error('querying every provider failed');
};