const nock = require('nock');
nock.disableNetConnect();

const ipapi = require('./ipapi.co');

test('api returns country', async () => {
    nock(`https://ipapi.co`)
        .get('/1.1.1.1/json/')
        .reply(200, { 'country_name': 'Test Country' });
    
    const country = await ipapi.getCountryFromIp('1.1.1.1');
    expect(country).toBe('Test Country');
});

test('api returns error', async () => {
    nock(`https://ipapi.co`)
        .get('/1.1.1.1/json/')
        .reply(200, { 'error': true, reason: 'test unhappy path' });
    
    expect(() => ipapi.getCountryFromIp('1.1.1.1')).rejects.toThrowError();
});