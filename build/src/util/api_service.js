import axios from 'axios';


/**@todo move the baseurl into a config file */
// const baseurl = 'http://localhost:5000/api';
const baseurl = 'http://frankchoongsaeng-examen-server.herokuapp.com/api';
let token = localStorage.getItem("token");

// create an axios client to use in making requests
const axiosClient = axios.create({
  baseURL: baseurl,
  headers: {
    token: token
  }
});

// failure interceptor for our axios client
const failureInterceptor = err => {
  
  if(err.response) {
    console.log(err.response)
  } else {
    console.log(err)
  }
  alert("there was an error");
  // return Promise.reject(err);
  return err;
}

// success interceptor for our axios client
const successInterceptor = res => {
  return res
}

// add interceptors to axios client
axiosClient.interceptors.response.use(successInterceptor, failureInterceptor);


// ============================================================ 
// ============================================================ 
// ============================================================ 
/**
 * 
 * functions below here are categorized by the 
 * type of data they send or recieve rather than 
 * the route they call
**/

/** USERS */
// POST - login
export function login(logindata) {
  return axiosClient.post('/users/login', logindata);
}

// POST - signup to create a new user record
export function signup(logindata) {
  return axiosClient.post('/users/signup', logindata);
}

// GET - get user details
export function getUser(userId) {
  return axiosClient.get(`/users/${userId}`);
} 


// ============================================================ 
// ============================================================ 
// ============================================================


/** TOKEN */
// GET - verify token
export function verifyToken(token) {
  return axiosClient.get(`/token/verify?token=${token}`);
}


// ============================================================ 
// ============================================================ 
// ============================================================


/** EXAMS */
// GET - get user exams
export function getAllExams() {
  return axiosClient.get(`/users/exams`)
}

// GET - get exam detail
export function getExam(examId) {
  return axiosClient.get(`/exams/${examId}`);
}

// GET - get published exams
export function getPublishedExams() {
  return axiosClient.get(`/exams/published`);
}

// GET - get draft exams
export function getDraftExams() {
  return axiosClient.get(`/exams/draft`);
}

// GET - get published exam by link
export function getExamByLink(link) {
  return axiosClient.get(`/exams/published/${link}`);
}

// POST - create a new exam 
export function createExam(examData) {
  return axiosClient.post(`/exams/create`, examData);
}

// POST - publishes an exam 
export function publishExam(id, examData) {
  return axiosClient.post(`/exams/${id}/publish`, examData);
}

// DELETE - delete an exam record
export function deleteExam(examId) {
  return axiosClient.delete(`/exams/${examId}`);
}


// ============================================================ 
// ============================================================ 
// ============================================================


/** QUESTIONS */
// GET - get exam questions id
export function getExamQuestions(examId) {
  return axiosClient.get(`/exams/${examId}/questions`);
}

// GET - get all exam questions data
export function getQuestionsWithData(examId) {
  return axiosClient.get(`/questions/all/${examId}`);
}

// GET - get question data
export function getQuestion(questionId) {
  return axiosClient.get(`/questions/${questionId}`);
}

// POST - add a question to an exam
export function saveQuestionToExam(questionData) {
  return axiosClient.post('/exams/question', questionData);
}

// POST - create a new question
export function saveQuestion(questionData) {
  return axiosClient.post('/questions', questionData);
}

// DELETE - delete a question record
export function deleteQuestion(questionId) {
  return axiosClient.delete(`/questions/${questionId}`);
}


// ============================================================ 
// ============================================================ 
// ============================================================


/** SUBMISSIONS */
// GET - get a single submission using an email
export function getSubmisionByEmail(email) {
  return axiosClient.get(`/submissions/single/${email}`);
}

// POST - add a new submission to db
export function saveNewSubmission(submissionData) {
  return axiosClient.post(`/submissions`, submissionData);
}

// POST - add a responseList to a submission
export function saveResponseList(submissionId, responseList) {
  return axiosClient.post(`/submissions/${submissionId}`, responseList);
}

// POST - end a submission
export function finishSubmission(finalSubmissionData) {
  return axiosClient.post(`submissions/finish`, finalSubmissionData);
}