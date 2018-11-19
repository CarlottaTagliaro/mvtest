var express = require('express'),
	router = express.Router();

router.get('/', (req, res) => {
	res.render('index', {
		page: 'home',
		title: 'Welcome to mvtest',
		objects: [{
			url: '/tasks',
			name: 'Tasks'
		}, {
			url: '/exams',
			name: 'Exams'
		}, {
			url: '/assignments',
			name: 'Assignments'
		}, {
			url: '/classes',
			name: 'Classes'
		}, {
			url: '/reviews',
			name: 'Reviews'
		}]
	});
});

router.get('/tasks', (req, res) => {
	res.render('index', {
		page: 'tasks',
		title: 'Your Tasks',
		objects: [{
			url: '/tasks/1',
			name: 'First Task',
			desc: 'This is the question of the task'
		}]
	});
});

router.get('/tasks/:id', (req, res) => {
	res.render('task', {
		page: 'tasks',
		task: {
			id: 2,
			question: 'Task Question',
			type: 1,
			choices: ['First answer', 'Second answer', 'Third answer'],
			users: [{
				id: 1,
				email: 'owner@email.com',
				owner: true,
				canWrite: true
			}]
		}
	})
});

router.get('/exams', (req, res) => {
	res.render('index', {
		page: 'exams',
		title: 'Your Exams',
		objects: [{
			url: '/exams/1',
			name: 'SE Midterm',
			desc: 'First midterm for the Software engeneering course'
		}]
	})
});

module.exports = router;