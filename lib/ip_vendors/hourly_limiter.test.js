const { HourlyLimiter } = require('./hourly_limiter');

test('zero limiter always throws', () => {
    const limiter = new HourlyLimiter(0);
    expect(() => limiter.incr()).toThrowError();
});

test.each([
    1,
    2,
    10,
])('limiter adds until %s items then throws', (num_per_hour) => {
    const currentTime = new Date('2020-01-01').getTime();
    jest.useFakeTimers().setSystemTime(currentTime);

    const limiter = new HourlyLimiter(num_per_hour);

    for (let _ = 0; _ < num_per_hour; _++) {
        limiter.incr();
    }

    // test that limiter has all items
    let item_count = 0;
    let item = limiter.head;
    while (item) {
        item_count += 1;
        item = item.next;
    }

    expect(item_count).toBe(num_per_hour)

    // attempt to add another
    expect(() => limiter.incr()).toThrowError();

    jest.setSystemTime(currentTime + 60*60*1000 + 1);
    limiter.incr()
});

test('limiter prunes items an hour old', () => {
    ONE_MINUTE = 60 * 1000;

    let currentTime = new Date('2020-01-01').getTime();
    jest.useFakeTimers().setSystemTime(currentTime);

    const limiter = new HourlyLimiter(60);

    // test that adding one per minute for an hour is fine
    for (i = 0; i < 60; i++) {
        limiter.incr();
        currentTime += ONE_MINUTE;
        jest.setSystemTime(currentTime);
    }
    
    // but then we'd expect the following to throw
    expect(() => limiter.incr()).toThrowError();

    // now test that adding one each subsequent minute succeeds
    // but that adding a second would throw
    for (i = 0; i < 60; i++) {
        currentTime += ONE_MINUTE;
        jest.setSystemTime(currentTime);
        limiter.incr();
        expect(() => limiter.incr()).toThrowError();
    }
});


test('limiter', () => {
    jest.useFakeTimers();
    const limiter = new HourlyLimiter(1);
    limiter.incr();
    expect(() => limiter.incr()).toThrowError();
});

test('limiter', () => {
    const startDate = new Date('2020-01-01').getTime();
    jest.useFakeTimers().setSystemTime(startDate);
    const limiter = new HourlyLimiter(1);
    limiter.incr();
    const anHourLater = startDate + 60*60*1000 + 1;
    jest.setSystemTime(anHourLater);
    limiter.incr();
});