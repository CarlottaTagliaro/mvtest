
function exam(db) {
    
    const GET_ALL_EXAMS_QUERY = "SELECT * FROM Exam, ExamTask WHERE Exam.Id=ExamTask.Id_Exam;"
    const GET_SINGLE_EXAM_QUERY = "SELECT * FROM Exam, ExamTask WHERE Exam.Id=ExamTask.Id_Exam AND Exam.Id=$1;"
    const DELETE_EXAM_QUERY = "DELETE FROM Exam WHERE Id=$1; DELETE FROM ExamTask WHERE Id_Exam=$1;"

    var self = this;
    self.db = db;

    self.getAll = () => {
        return new Promise((resolve, reject) => {
            self.db.query(GET_ALL_EXAMS_QUERY)
                .then(res => {
                    resolve(res.rows);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    self.getOne = (id) => {
		return new Promise((resolve, reject) => {
			self.db.query(GET_SINGLE_EXAM_QUERY, [id])
				.then((res) => {
					if (res.rows.length == 0) {
						let error = new Error("Exam not found");
						error.errno = 404;
						reject(error);
					} else {
						resolve(res.rows[0]);
					}
				})
				.catch((err) => {
					console.log(err);
					reject(err);
				});
		});

    }

    
}