const CLASS_TEMPLATE = {
  id : expect.any(Number),
  name : expect.any(String),
}

var class_gc = null;
var request = require('supertest')(require('../../app.js'));

describe('POST', () => {
	test('POST /classes with wrong data should return error', () => {
		expect.assertions(1);

		return request.post('/api/classes', {
			noot: "noot"
		}).then(res => {
			expect(res.statusCode).toBe(500);
		});
	});

	test('POST /classes with right data should return an id', () => {
		expect.assertions(2);

		let class_tmp = {
				name: "Knack",
			  users : [
          {
            id : 1,
            email: "itsame@gmail.com",
            name : "Jonny good meme"
          }
        ]
      },
			expected = {
				id: expect.any(Number)
			};

		return request.post('/api/classes').send(class_tmp).then(res => {
			class_gc = JSON.parse(res.text).id;
			console.log(class_gc);
      console.warn(res.text);
			expect(res.statusCode).toBe(201);
			expect(JSON.parse(res.text)).toEqual(expect.objectContaining(expected));
		});
	});
});

describe('GET', () => {
	test('GET /classes should return a list of classes', () => {
		expect.assertions(2);

		return request.get('/api/classes').then(res => {
			expect(res.statusCode).toBe(200);
			expect(JSON.parse(res.text)).toEqual(expect.arrayContaining([CLASS_TEMPLATE]));
		});
	});

	test('GET /classes/:id should return class', () => {
		expect.assertions(2);

		return request.get('/api/classes/' + class_gc).then(res => {
			expect(res.statusCode).toBe(200);
			expect(JSON.parse(res.text)).toEqual(expect.objectContaining(CLASS_TEMPLATE));
		});
	});
  //in the trial of pg we have only 10k rows total
	test('GET /classes/10001 should return 500', () => {
		expect.assertions(1);

		return request.get('/api/classes/1001').then(res => {
			expect(res.statusCode).toBe(500);
		});
	});

	test('GET /classes/-10 with wrong id should return an error', () => {
		expect.assertions(1);

		return request.get('/api/classes/-10').then(res => {
			expect(res.statusCode).toBe(500);
		});
	});
});

describe('PUT', () => {

	var class_tmp = {
	  name : "Knack2",
    users : [
      {
        id : 1,
        name: "Jonny bad meme",
        email: "itsastillme@gmail.com"
      }
    ]
  };

	test('PUT /classes/:id with wrong id should return error', () => {
		expect.assertions(1);

		return request.post('/api/classes/4564225').send(class_tmp)
			.then(res => {
				expect(res.statusCode).toBe(404);
			});
	});

	test('PUT /classes with right data should return an id', () => {
		expect.assertions(1);

		return request.put('/api/classes/' + class_gc).send(class_tmp)
			.then(res => {
				expect(res.statusCode).toBe(500);
			});
	});
});

describe('DELETE', () => {
	test('DELETE /classes/:id with wrong id should return error', () => {
		expect.assertions(1);

		return request.delete('/api/classes/notanumber')
			.then(res => {
				expect(res.statusCode).toBe(500);
			});
	});

	test('DELETE /classes/:id should delete a class', () => {
		expect.assertions(2);

		return request.delete('/api/classes/' + class_gc)
			.then(res => {
				expect(res.statusCode).toBe(204);
				expect(res.text).toBe("");
			});
	});
});
