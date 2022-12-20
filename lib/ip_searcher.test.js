const providers = require('./ip_vendors');
const cache = require('./cache');
jest.mock('./ip_vendors', () => {
    return {
        'test_provider1': {
            getCountryFromIp: jest.fn((_) => 'Test Country 1')
        },
        'test_provider2': {
            getCountryFromIp: jest.fn((_) => 'Test Country 2')
        },
    }
});
const ip_searcher = require('./ip_searcher');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('no cache', () => {
    afterEach(() => {
        Object.keys(cache).forEach(key => delete cache[key]);
    });

    test('searches first provider', async () => {
        const country = await ip_searcher.getCountryFromIp('1.1.1.1');
        expect(country).toBe('Test Country 1');
    });

    test('falls back to second provider', async () => {
        providers['test_provider1'].getCountryFromIp = jest.fn((_) => Promise.reject('something went wrong'));

        const country = await ip_searcher.getCountryFromIp('1.1.1.1');
        expect(country).toBe('Test Country 2');
    });
});

test('uses cache', async () => {
    cache['1.1.1.1'] = 'Cached Test Country';

    const country = await ip_searcher.getCountryFromIp('1.1.1.1');
    expect(country).toBe('Cached Test Country');
    Object.keys(providers).forEach((key) => expect(providers[key].getCountryFromIp).not.toHaveBeenCalled());
});