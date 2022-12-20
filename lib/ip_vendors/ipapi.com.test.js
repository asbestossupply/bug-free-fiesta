const nock = require('nock');
nock.disableNetConnect();

const ipapi = require('./ipapi.com');

test('api returns country', async () => {
    nock(`http://ip-api.com`)
        .get('/json/1.1.1.1')
        .reply(200, { 'country': 'Test Country' });
    
    const country = await ipapi.getCountryFromIp('1.1.1.1');
    expect(country).toBe('Test Country');
});

test('api returns error', async () => {
    nock(`http://ip-api.com`)
        .get('/json/1.1.1.1')
        .reply(200, { 'status': 'fail', message: 'test unhappy path' });
    
    expect(() => ipapi.getCountryFromIp('1.1.1.1')).rejects.toThrowError();
});