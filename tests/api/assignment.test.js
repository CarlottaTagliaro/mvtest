const EXPECTED_ASSIGN = {
    id: expect.any(Number),
    deadline: expect.any(String),
    review: expect.any(Boolean),
    id_user: expect.any(Number),
    id_exam: expect.any(Number),
    id_class: expect.any(Number)
};

var assignId = null;
var request = require('supertest')(require('../../app.js'));

describe('POST', () => {
    test('POST /assignments with wrong data should return error', () => {
        expect.assertions(1);

        return request.post('/api/assignments', {
            ciao: 'mamma'
        }).then(res => {
            expect(res.statusCode).toBe(500);
        });
    });

    test('POST /assignments with right data should return an id', () => {
        expect.assertions(2);

        let assign = {
                deadline: '2018-12-3',
                review: true,
                id_user: 2,
                id_exam: 2,
                id_class: 2
            },
            expected = {
                id: expect.any(Number)
            };

        return request.post('/api/assignments').send(assign).then(res => {
            assignId = JSON.parse(res.text).id;
            console.log(assignId);
            expect(res.statusCode).toBe(201);
            expect(JSON.parse(res.text)).toEqual(expect.objectContaining(expected));
        });
    });
});

describe('GET', () => {
    test('GET /assignments should return a list of assignments', () => {
        expect.assertions(2);

        return request.get('/api/assignments').then(res => {
            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res.text)).toEqual(expect.arrayContaining([EXPECTED_ASSIGN]));
        });
    });

    test('GET /assignments/:id should return assignment', () => {
        expect.assertions(2);

        return request.get('/api/assignments/' + assignId).then(res => {
            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res.text)).toEqual(expect.objectContaining(EXPECTED_ASSIGN));
        });
    });

    test('GET /assignments/25556 should return 404', () => {
        expect.assertions(1);

        return request.get('/api/assignments/25556').then(res => {
            expect(res.statusCode).toBe(404);
        });
    });

    test('GET /assignments/-10 with wrong id should return an error', () => {
        expect.assertions(1);

        return request.get('/api/assignments/-10').then(res => {
            expect(res.statusCode).toBe(404);
        });
    });
});

describe('PUT', () => {

    let assign = {
        deadline: '2018-12-13',
        review: false,
        id_user: 2,
        id_exam: 2,
        id_class: 2
    };

    test('PUT /assignments/:id with wrong id should return error', () => {
        expect.assertions(1);

        return request.post('/api/assignments/4564225').send(assign)
            .then(res => {
                expect(res.statusCode).toBe(404);
            });
    });

    test('PUT /assignments with right data should return an id', () => {
        expect.assertions(2);

        return request.put('/api/assignments/' + assignId).send(assign)
            .then(res => {
                expect(res.statusCode).toBe(204);
                expect(res.text).toBe("");
            });
    });
});

describe('DELETE', () => {
    test('DELETE /assignments/:id with wrong id should return error', () => {
        expect.assertions(1);

        return request.delete('/api/assignments/notanumber')
            .then(res => {
                expect(res.statusCode).toBe(500);
            });
    });

    test('DELETE /assignments/:id should delete an assignment', () => {
        expect.assertions(2);

        return request.delete('/api/assignments/' + assignId)
            .then(res => {
                expect(res.statusCode).toBe(204);
                expect(res.text).toBe("");
            });
    });
});