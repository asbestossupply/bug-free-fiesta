const request = require("supertest");
const { getCountryFromIp } = require('./lib/ip_searcher');
jest.mock('./lib/ip_searcher', () => {
    return {
        getCountryFromIp: jest.fn((_) => 'Test Country')
    }
});
const app = require('./app');

test('post / success', (done) => {
    request(app)
        .post('/')
        .send({ ip: '8.8.8.8' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.result).toBe('Test Country')
        })
        .end(function (err, res) {
            if (err) return done(err);
            return done();
        });
});

test('post / bad ip', (done) => {
    request(app)
        .post('/')
        .send({ ip: 'bad ip' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((res) => {
            expect(res.body.success).toBe(false);
            expect(res.body.error).toContain('bad ip')
        })
        .end(function (err, res) {
            if (err) return done(err);
            return done();
        });
});

test('post / ip lookup fails', (done) => {
    getCountryFromIp.mockImplementation(() => Promise.reject('something went wrong'));
    request(app)
        .post('/')
        .send({ ip: '8.8.8.8' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .expect((res) => {
            expect(res.body.success).toBe(false);
            expect(res.body.error).toContain('something went wrong')
        })
        .end(function (err, res) {
            if (err) return done(err);
            return done();
        });
});