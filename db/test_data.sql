--TEST DATA FILE

--Users
INSERT INTO Users VALUES(DEFAULT,'Pippo@gmail.com', 'Pippo');
INSERT INTO Users VALUES(DEFAULT,'Topolino@gmail.com', 'Topolino');
INSERT INTO Users VALUES(DEFAULT,'Paperino@gmail.com', 'Paperino');
INSERT INTO Users VALUES(DEFAULT,'PaperPaperogaino@gmail.com', 'Paperoga');
--Type
INSERT INTO Type VALUES(DEFAULT,'Open answer');
INSERT INTO Type VALUES(DEFAULT,'Single choice answer');
INSERT INTO Type VALUES(DEFAULT,'Multiple choice answer');
--Task
INSERT INTO Task VALUES(DEFAULT,'{"question": "Domanda aperta generica1" }', 10, 1);
INSERT INTO Task VALUES(DEFAULT,'{"question": "Domanda aperta generica1" }', 5, 1);
INSERT INTO Task VALUES(DEFAULT,'{"question": "Domanda aperta generica1" }', 7, 1);
INSERT INTO Task VALUES(DEFAULT,'{"question": "Single choice 1", "choices": ["First","Second"]}', 10, 2);
INSERT INTO Task VALUES(DEFAULT,'{"question": "Single choice 2", "choices": ["First","Second"]}', 12, 2);
INSERT INTO Task VALUES(DEFAULT,'{"question": "Multiple Choice", "choices": ["First","Second"]}', 10, 3);
--Rights
INSERT INTO Rights VALUES(1, 1, true, true);
INSERT INTO Rights VALUES(2, 1, false, true);
INSERT INTO Rights VALUES(3, 1, false, false);
INSERT INTO Rights VALUES(2, 2, true, true);
INSERT INTO Rights VALUES(4, 2, false, true);
INSERT INTO Rights VALUES(3, 3, true, true);
INSERT INTO Rights VALUES(1, 3, false, true);
INSERT INTO Rights VALUES(2, 4, true, true);
INSERT INTO Rights VALUES(1, 5, true, true);
INSERT INTO Rights VALUES(4, 6, true, true);
INSERT INTO Rights VALUES(2, 6, false, true);
--Exam
INSERT INTO Exam VALUES(DEFAULT,1);
INSERT INTO Exam VALUES(DEFAULT,2);
--ExamTask
INSERT INTO ExamTask VALUES(1,1);
INSERT INTO ExamTask VALUES(1,2);
INSERT INTO ExamTask VALUES(1,3);
INSERT INTO ExamTask VALUES(2,4);
INSERT INTO ExamTask VALUES(2,5);
INSERT INTO ExamTask VALUES(2,6);
--Class
INSERT INTO Class VALUES(DEFAULT,'Special ED class');
INSERT INTO Class VALUES(DEFAULT,'Another class');
--ClassUser
INSERT INTO ClassUser VALUES(1,1);
INSERT INTO ClassUser VALUES(1,2);
INSERT INTO ClassUser VALUES(1,3);
INSERT INTO ClassUser VALUES(1,4);
INSERT INTO ClassUser VALUES(2,3);
INSERT INTO ClassUser VALUES(2,4);
--Assignment
INSERT INTO Assign VALUES(DEFAULT,'2018-12-3',true,2,1,1);
INSERT INTO Assign VALUES(DEFAULT,'2018-12-3',false,2,2,2);
