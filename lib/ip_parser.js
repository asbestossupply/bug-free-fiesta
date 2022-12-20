module.exports.is_valid_ip = function (ip) {
    console.log(`ip: ${ip}`)
    if (!ip || ip.length > 15) {
        return false;
    }

    const parts = ip.split('.');

    if (parts.length !== 4) {
        return false;
    }

    for (const p of parts) {
        const octet = parseInt(p, 10);
        if (octet < 0 || octet > 255 || `${octet}` !== p) {
            return false;
        }
    }

    return true;
}