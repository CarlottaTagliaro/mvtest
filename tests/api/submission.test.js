const EXPECTED_SUB = {
    id: expect.any(Number),
    time: expect.any(String),
    answer: expect.any(String),
    id_assign: expect.any(Number),
    id_user: expect.any(Number),
    id_task: expect.any(Number)
};

var subId = null;
var request = require('supertest')(require('../../app.js'));

describe('POST', () => {
    test('POST /api/assignments/1/submissions with wrong data should return error', () => {
        expect.assertions(1);

        return request.post('/api/assignments/1/submissions', {
            ciao: 'mamma'
        }).then(res => {
            expect(res.statusCode).toBe(500);
        });
    });

    test('POST api/assignments/2/submissions with right data should return an id', () => {
        expect.assertions(2);

        let sub = {
                answer: 'The answer is none of them',
                id_user: 4,
                id_task: 4
            },
            expected = {
                id: expect.any(Number)
            };

        return request.post('/api/assignments/2/submissions').send(sub).then(res => {
            subId = JSON.parse(res.text).id;
            expect(res.statusCode).toBe(201);
            expect(JSON.parse(res.text)).toEqual(expect.objectContaining(expected));
        });
    });
});

describe('GET', () => {
    test('GET /assignments/1/submissions should return a list of submissions', () => {
        expect.assertions(2);

        return request.get('/api/assignments/1/submissions').then(res => {
            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res.text)).toEqual(expect.arrayContaining([EXPECTED_SUB]));
        });
    });
});

describe('DELETE', () => {
    test('DELETE /assignments/2/submissions with no user id should return error', () => {
        expect.assertions(1);

        return request.delete('/api/assignments/2/submissions')
            .then(res => {
                expect(res.statusCode).toBe(500);
            });
    });

    test('DELETE /assignments/2/submissions should delete all sub', () => {
        expect.assertions(2);

        body = {
            id_user: 4
        };

        return request.delete('/api/assignments/2/submissions').send(body)
            .then(res => {
                expect(res.statusCode).toBe(204);
                expect(res.text).toBe("");
            });
    });

});