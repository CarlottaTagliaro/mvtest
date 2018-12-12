//
// Every class inside this file is a controller
// taking an array and parsing it into the json
// class expected for communication
//
function not_nu_and_len (arr, len) {
  if (arr == null || arr === undefined || arr.length !== len) {
    throw new Error('Assertion failed on array ' + arr + ' expected to be of len ' + len)
  }
  return true
}

function UserC (arr) {
  not_nu_and_len(arr, 3)
  let self = this
  self.Id = parseInt(arr[0])
  self.Email = arr[1]
  self.Name = arr[2]
}

function TypeC (arr) {
  not_nu_and_len(arr, 2)
  let self = this
  self.Id = parseInt(arr[0])
  self.Name = arr[1]
}

function TaskC (arr) {
  not_nu_and_len(arr, 4)
  let self = this
  self.Id = parseInt(arr[0])
  self.Text = arr[1]
  self.Points = parseInt(arr[2])
  self.Id_Type = parseInt(arr[3])
}

function RightsC (arr) {
  not_nu_and_len(arr, 4)
  let self = this
  self.Id_User = parseInt(arr[0])
  self.Id_Task = parseInt(arr[1])
  self.Owner = Boolean(arr[2])
  self.Modifier = Boolean(arr[3])
}

function ExamC (arr) {
  not_nu_and_len(arr, 2)
  let self = this
  self.Id = parseInt(arr[0])
  self.Id_Creator = parseInt(arr[1])
}

function ExamTaskC (arr) {
  not_nu_and_len(arr, 2)
  let self = this
  self.Id_Exam = parseInt(arr[0])
  self.Id_Creator = parseInt(arr[1])
}

function ClassC (arr) {
  not_nu_and_len(arr, 2)
  let self = this
  self.Id = parseInt(arr[0])
  self.Name = arr[1]
}

function ClassUserC (arr) {
  not_nu_and_len(arr, 2)
  let self = this
  self.Id_Class = parseInt(arr[0])
  self.Id_User = parseInt(arr[1])
}

function AssignC (arr) {
  not_nu_and_len(arr, 6)
  let self = this
  self.Id = parseInt(arr[0])
  self.Deadline = Date.parse(arr[1])
  self.Review = Boolean(arr[2])
  self.Id_User = parseInt(arr[3])
  self.Id_Exam = parseInt(arr[4])
  self.Id_Class = parseInt(arr[5])
}

function SubmissionC (arr) {
  not_nu_and_len(arr, 6)
  let self = this
  self.Id = parseInt(arr[0])
  self.Time = Date.parse(arr[1])
  self.Answer = arr[2]
  self.Id_Assign = parseInt(arr[3])
  self.Id_User = parseInt(arr[4])
  self.Id_Task = parseInt(arr[5])
}

function EvaluationC (arr) {
  not_nu_and_len(arr, 5)
  let self = this
  self.Mark = parseInt(arr[0])
  self.Comment = arr[1]
  self.Id_User = parseInt(arr[2])
  self.Id_Submission = parseInt(arr[3])
  self.Time_Submission = Date.parse(arr[4])
}

module.export = {
  UserC,
  TypeC,
  TaskC,
  RightsC,
  ExamC,
  ExamTaskC,
  ClassC,
  ClassUserC,
  AssignC,
  SubmissionC,
  EvaluationC
}
