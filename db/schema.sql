DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

CREATE TABLE IF NOT EXISTS Users(
  Id SERIAL,
  Email CHAR(255) NOT NULL,
  Name CHAR(255) NOT NULL,
  PRIMARY KEY(Id)
);

CREATE TABLE IF NOT EXISTS Type(
  Id SERIAL,
  Name CHAR(255),
  PRIMARY KEY(Id)
);

CREATE TABLE IF NOT EXISTS Task(
  Id SERIAL,
  Text CHAR(4000),
  Id_Type INTEGER REFERENCES Type,
  PRIMARY KEY(Id)
);


CREATE TABLE IF NOT EXISTS Rights(
  Id_User INTEGER NOT NULL REFERENCES Users(Id),
  Id_Task INTEGER NOT NULL REFERENCES Task(Id),
  Owner BOOLEAN DEFAULT FALSE,
  Modifier BOOLEAN DEFAULT FALSE,
  PRIMARY KEY(Id_User, Id_Task)
);

CREATE TABLE IF NOT EXISTS Exam(
  Id SERIAL,
  Id_Creator INTEGER NOT NULL REFERENCES Users(Id),
  PRIMARY KEY(Id)
);

CREATE TABLE IF NOT EXISTS ExamTask(
  Id_Exam INTEGER NOT NULL REFERENCES Exam(Id),
  Id_Task INTEGER NOT NULL REFERENCES Task(Id),
  PRIMARY KEY(Id_Exam, Id_Task)
);

CREATE TABLE IF NOT EXISTS Class(
  Id SERIAL,
  Name CHAR(255),
  PRIMARY KEY(Id)
);

CREATE TABLE IF NOT EXISTS ClassUser(
  Id_Class INTEGER NOT NULL REFERENCES Class(Id),
  Id_User INTEGER NOT NULL REFERENCES Users(Id)
);

CREATE TABLE IF NOT EXISTS Assign(
  Id SERIAL,
  Deadline DATE NOT NULL,
  Review BOOLEAN DEFAULT FALSE,

  Id_User INTEGER NOT NULL REFERENCES Users(Id),
  Id_Exam INTEGER NOT NULL REFERENCES Exam(Id),
  Id_Class INTEGER NOT NULL REFERENCES Class(Id),

  PRIMARY KEY(Id)
);

CREATE TABLE IF NOT EXISTS Submission(
  Id SERIAL,
  Time DATE NOT NULL,
  Answer CHAR(2048) NOT NULL,
  Id_Assign INTEGER NOT NULL REFERENCES Assign(Id),
  Id_User INTEGER NOT NULL REFERENCES Users(Id),
  Id_Task INTEGER NOT NULL REFERENCES Task(Id),
  PRIMARY KEY(Id, Time)
);

CREATE TABLE IF NOT EXISTS Evaluation(
  Mark INTEGER NOT NULL,
  Comment CHAR(1024),
  Id_User INTEGER NOT NULL REFERENCES Users(Id),
  Id_Submission INTEGER NOT NULL,
  Time_Submission DATE NOT NULL,
  FOREIGN KEY (Id_Submission, Time_Submission) REFERENCES Submission(Id, Time)
);

CREATE OR REPLACE FUNCTION GetExamTasks (_id_exam INTEGER)
  RETURNS TABLE(
    Id_Task INTEGER,
    Text CHAR(4000),
    Id_Type INTEGER,
    Type_Name CHAR(255)
) AS $$
BEGIN
  RETURN QUERY 
    SELECT Task.Id AS Id_Task, Task.Text, Task.Id_Type, Type.Name AS Type_Name 
    FROM Task JOIN ExamTask ON Task.Id = ExamTask.Id_Task
    JOIN Type ON Task.Id_Type = Type.Id
    WHERE ExamTask.Id_Exam = _id_exam
  ;
END; $$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION GetAssignmentsForUser(_id_user INTEGER)
  RETURNS TABLE(
    Id_Exam INTEGER,
    Id_Creator INTEGER,
    Deadline DATE
) AS $$
BEGIN
  RETURN QUERY
    SELECT Exam.Id as Id_Exam, Exam.Id_Creator, Assign.Deadline
    FROM Exam JOIN Assign ON Exam.Id = Assign.Id_Exam
    WHERE _id_user IN (
      SELECT ClassUser.Id_User FROM ClassUser
      WHERE ClassUser.Id_Class = Assign.Id_Class
    ) 
  ;
END; $$
LANGUAGE 'plpgsql';
