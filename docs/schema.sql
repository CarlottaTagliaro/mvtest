CREATE DATABASE IF NOT EXISTS MVTEST_DB;

CREATE TABLE IF NOT EXISTS User(
  Email CHAR(255) NOT NULL,
  Name CHAR(255) NOT NULL,
  PRIMARY KEY(Email)
);

CREATE TABLE IF NOT EXISTS Type(
  Id SERIAL,
  Name CHAR(255),
  PRIMARY KEY(Id)
);

CREATE TABLE IF NOT EXISTS Rights(
  Id_User INTEGER NOT NULL REFERENCES User(Id),
  Id_Task INTEGER NOT NULL REFERENCES Task(Id),
  Owner BOOLEAN DEFAULT FALSE,
  Modifier BOOLEAN DEFAULT FALSE
  PRIMARY KEY(Id_User, Id_Task)
);

CREATE TABLE IF NOT EXISTS Task(
  Id SERIAL,
  Text CHAR(4000),
  Id_Type INTEGER REFERENCES Type,
  PRIMARY KEY(Id)
);

CREATE TABLE IF NOT EXISTS Exam(
  Id SERIAL,
  Id_Creator INTEGER NOT NULL REFERENCES User(Id),
  PRIMARY KEY(Id)
);

CREATE TABLE IF NOT EXISTS ExamTask(
  Id_Exam INTEGER NOT NULL REFERENCES Exam(Id),
  Id_Task INTEGER NOT NULL REFERENCES Task(Id)
);

CREATE TABLE IF NOT EXISTS Class(
  Id SERIAL,
  Name CHAR(255),
  PRIMARY KEY(Id)
);

CREATE TABLE IF NOT EXISTS ClassUser(
  Id_Class INTEGER NOT NULL REFERENCES Class(Id),
  Id_User INTEGER NOT NULL REFERENCES User(Id)
);

CREATE TABLE IF NOT EXISTS Assign(
  Id SERIAL,
  Deadline DATE NOT NULL,
  Review BOOLEAN DEFAULT FALSE,

  Id_User INTEGER NOT NULL REFERENCES User(Id),
  Id_Exam INTEGER NOT NULL REFERENCES Exam(Id),
  Id_Class INTEGER NOT NULL REFERENCES Class(Id),
);

CREATE TABLE IF NOT EXISTS Evaluation(
  Mark INTEGER NOT NULL,
  Comment CHAR(1024),
  Id_User INTEGER NOT NULL REFERENCES User(Id),
  Id_Submission INTEGER NOT NULL REFERENCES Submission(Id)
);

CREATE TABLE IF NOT EXISTS Submission(
  Id SERIAL,
  Time DATE NOT NULL,
  Answer CHAR(2048) NOT NULL,
  Id_Assign INTEGER NOT NULL REFERENCES Assign(Id),
  Id_User INTEGER NOT NULL REFERENCES User(Id),
  Id_Task INTEGER NOT NULL REFERENCES Task(Id),
  PRIMARY KEY(Id, Time)
);
