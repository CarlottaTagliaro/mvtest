--TEST DATA FILE

--Users
INSERT INTO Users VALUES(0,"Pippo@gmail.com", "Pippo");
INSERT INTO Users VALUES(1,"Topolino@gmail.com", "Topolino");
INSERT INTO Users VALUES(2,"Paperino@gmail.com", "Paperino");
INSERT INTO Users VALUES(3,"PaperPaperogaino@gmail.com", "Paperoga");
--Type
INSERT INTO Type VALUES(0, "Open question");
INSERT INTO Type VALUES(1, "3 answer question");
--Task
INSERT INTO Task VALUES(0,"Domanda aperta generica1", 0);
INSERT INTO Task VALUES(1,"Domanda aperta generica2", 0);
INSERT INTO Task VALUES(2,"Domanda aperta generica2", 0);
INSERT INTO Task VALUES(3,"Domanda multi generica1", 1);
INSERT INTO Task VALUES(4,"Domanda multi generica2", 1);
INSERT INTO Task VALUES(5,"Domanda multi generica3", 1);
--Exam
INSERT INTO Exam VALUES(0, 0);
INSERT INTO Exam VALUES(1, 1);
--ExamTask
INSERT INTO ExamTask VALUES(0,0);
INSERT INTO ExamTask VALUES(0,1);
INSERT INTO ExamTask VALUES(0,2);
INSERT INTO ExamTask VALUES(1,3);
INSERT INTO ExamTask VALUES(1,4);
INSERT INTO ExamTask VALUES(1,5);
--Class
INSERT INTO Class VALUES(0, "Special ED class");
INSERT INTO Class VALUES(1, "Another class");
--ClassUser
INSERT INTO ClassUser VALUES(0, 0);
INSERT INTO ClassUser VALUES(0, 1);
INSERT INTO ClassUser VALUES(0, 2);
INSERT INTO ClassUser VALUES(0, 3);
INSERT INTO ClassUser VALUES(1, 2);
INSERT INTO ClassUser VALUES(1, 3);