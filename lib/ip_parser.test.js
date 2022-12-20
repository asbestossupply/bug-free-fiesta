
const { is_valid_ip } = require('./ip_parser');

test.each([
    '255.255.255.256',
    '255.255.255.255.255',
    '255.255.255',
    'asdf',
    'a.a.a.a',
])('is_valid_ip invalid (%s)', (ip) => {
    is_valid = is_valid_ip(ip);
    return expect(is_valid).toBe(false);
});

test.each([
    '255.255.255.255',
    '1.2.3.4',
    '0.0.0.0',
])('is_valid_ip valid (%s)', (ip) => {
    is_valid = is_valid_ip(ip);
    return expect(is_valid).toBe(true);
});