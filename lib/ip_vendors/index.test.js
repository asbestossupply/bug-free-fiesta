const providers = require('./index');

test('providers', () => {
    expect(Object.keys(providers).length).toBe(2);
});