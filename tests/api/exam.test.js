const EXPECTED_EXAM = {
    id: expect.any(Number),
    id_creator: expect.any(Number),
    tasks: expect.any(Array)
};

EXAMS = {
    id: expect.any(Number),
    id_creator: expect.any(Number)
}

var examId = null;
var request = require('supertest')(require('../../app.js'));

describe('POST', () => {
    test('POST /exams with wrong data should return error', () => {
        expect.assertions(1);

        return request.post('/api/exams', {
            ciao: 'mamma'
        }).then(res => {
            expect(res.statusCode).toBe(500);
        });
    });

    test('POST /exams with right data should return an id', () => {
        expect.assertions(2);

        let exam = {
                id_creator: 2,
                tasks: [1, 2, 3]
            },
            expected = {
                id: expect.any(Number)
            };

        return request.post('/api/exams').send(exam).then(res => {
            examId = JSON.parse(res.text).id;
            console.log(examId);
            expect(res.statusCode).toBe(201);
            expect(JSON.parse(res.text)).toEqual(expect.objectContaining(expected));
        });
    });
});

describe('GET', () => {
    test('GET /exams should return a list of exams', () => {
        expect.assertions(2);

        return request.get('/api/exams').then(res => {
            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res.text)).toEqual(expect.arrayContaining([EXAMS]));
        });
    });

    test('GET /exams/:id should return exam', () => {
        expect.assertions(2);

        return request.get('/api/exams/' + examId).then(res => {
            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res.text)).toEqual(expect.objectContaining(EXPECTED_EXAM));
        });
    });

    test('GET /exams/25556 should return 404', () => {
        expect.assertions(1);

        return request.get('/api/exams/25556').then(res => {
            expect(res.statusCode).toBe(404);
        });
    });

    test('GET /exams/-10 with wrong id should return an error', () => {
        expect.assertions(1);

        return request.get('/api/exams/-10').then(res => {
            expect(res.statusCode).toBe(404);
        });
    });
});

describe('PUT', () => {

	let exam = {
		id_creator: 2,
		tasks: [4, 5, 6]
	}

    test('PUT /exams/:id with wrong id should return error', () => {
        expect.assertions(1);

        return request.post('/api/exams/4564225').send(exam)
            .then(res => {
                expect(res.statusCode).toBe(404);
            });
    });

    test('PUT /exams with right data should return an id', () => {
        expect.assertions(2);

        return request.put('/api/exams/' + examId).send(exam)
            .then(res => {
                expect(res.statusCode).toBe(204);
                expect(res.text).toBe("");
            });
    });
});

describe('DELETE', () => {
    test('DELETE /exams/:id with wrong id should return error', () => {
        expect.assertions(1);

        return request.delete('/api/exams/notanumber')
            .then(res => {
                expect(res.statusCode).toBe(500);
            });
    });

    test('DELETE /exams/:id should delete a exam', () => {
        expect.assertions(2);

        return request.delete('/api/exams/' + examId)
            .then(res => {
                expect(res.statusCode).toBe(204);
                expect(res.text).toBe("");
            });
    });

    test('DELETE /exams/:id with wrong id should return error', () => {
        expect.assertions(1);
        return request.delete('/api/exams/' + examId)
            .then(res => {
                expect(res.statusCode).toBe(404);
            });
    });
});