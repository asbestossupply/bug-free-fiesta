jest.mock('./hourly_limiter');
const { HourlyLimiter } = require('./hourly_limiter');
HourlyLimiter.mockImplementation(() => {
    return {
        incr: jest.fn()
    }
});

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

test('sets hourly limit to 5', async () => {
    HourlyLimiter.mock.results[0].value.incr.mockClear();
    expect(HourlyLimiter).toHaveBeenCalledWith(5);
    
    nock(`http://ip-api.com`)
        .get('/json/1.1.1.1')
        .reply(200, { 'country': 'Test Country' });

    await ipapi.getCountryFromIp('1.1.1.1');
    expect(HourlyLimiter.mock.results[0].value.incr).toHaveBeenCalledTimes(1);
});