import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EditorState, convertFromRaw } from 'draft-js';
import { stateToHTML as tohtml } from 'draft-js-export-html';
import { Parser } from 'html-to-react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import alerter from '../util/alert';
import {
  getExamByLink,
  getQuestionsWithData as getQuestions,
  getSubmisionByEmail,
  saveNewSubmission as save,
  finishSubmission as submit,
  saveResponseList as saveList
} from '../util/api_service';
import useStorage from './useStorage';

export default function Layout() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [examData, setExamData] = useState({});
  const [submissionData, setSubmissionData] = useState({});
  const [currentSelectedQuestion, setCurrentSelectedQuestion] = useState();
  const [currentQuestionNumber, setCurrentQuestionNumber] = useStorage("cqn", "0");
  const [responseList, setResponseList] = useStorage("resls", []);

  const [isNewSubmission, setIsNewSubmission] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isExamReady, setIsExamReady] = useState(false);
  const [questionLoaded, setQuestionLoaded] = useState(false);
  const [isValidExam, setIsValidExam] = useState(false);
  const [isExamError, setIsExamError] = useState(false);

  const [show, setShow] = useState(false);
  const init = useRef();
  const params = useParams();


  // closes the modal
  const handleCloseModal = () => {
    setShow(false);
  }

  // opens the modal
  const handleOpenModal = () => {
    setShow(true);
  }

  // use this to handle changeResponseText in textarea box
  const handleChangeResponse = (e) => {
    let newResponse = { questionId: currentSelectedQuestion._id, response: e.target.value };
    setResponseList(currentList => {
      console.log({ currentList });
      console.log({ assertion: Array.isArray(currentList) });
      let newResponseList = [...currentList];
      newResponseList[parseInt(currentQuestionNumber)] = newResponse;
      return newResponseList;
    })
  }

  // makes sure the user is prepared to take the exam
  // this includes making sure the user has entered his 
  // firstname, lastname, email, and has confirmed that
  // he/she is ready to take the exam
  const handlePrepareUser = (e) => {
    e.preventDefault();

    if (!email || !(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) {
      return alerter.error("Please type in a valid email");
    }

    retrieveSubmissionData(email, (res) => {
      if (res.data) {

        // if it got here, then the candidate is continuing
        setSubmissionData(res.data);
        // setIsExamReady(true);
        handleCloseModal();
      }
      else {

        // if it fell here, then the candidate is here for the first time
        if (firstName && lastName) {

          // make sure they provide the a firstname and a lastname
          let submission = {
            email: email,
            first_name: firstName,
            last_name: lastName,
            examId: examData._id,
            started: new Date(),
            submitted: false,
            responses: []
          };

          save(submission)
            .then(res => {
              setSubmissionData(res.data);
              // setIsExamReady(true);
              handleCloseModal();
            })
        }
        else if (isNewSubmission) {
          alerter.error("the First and Last name fields are required");
        }
        else {
          setIsNewSubmission(true);
        }
      }
    });
  }


  // use this to get the current session response/submission data
  const retrieveSubmissionData = (email, callback = () => { }) => {
    getSubmisionByEmail(email)
      .then(res => {
        setSubmissionData(res.data);
        if (res.data && res.data.responses && res.data.responses.length > 0) {
          setResponseList(res.data.responses);
        }
        callback(res);
      });
  }

  // use this method to make a request to the 
  // database for getting all questions for this exams
  const getExamQuestions = (examId, callback = () => { }) => {
    getQuestions(examId)
      .then(res => {

        // replace the question list in the exam data with the actual questions
        let _questionsFromList = examData.questions.map(id => res.data.filter(q => q._id === id)[0])
        setExamData(ed => ({ ...ed, questions: [..._questionsFromList], altered: true }));
        setQuestionLoaded(true);
        callback(res);
      });
  }


  // use this to select a question 
  // it handles selecting the question, and the question number
  const selectQuestion = (questionNum) => {
    if (!(questionNum < 0 || questionNum >= examData.questions.length)) {
      setCurrentQuestionNumber(questionNum);
      setCurrentSelectedQuestion(examData.questions[parseInt(questionNum)]);
    }
  }



  // use this to submit the exam questions
  const submitResponseList = () => {
    saveList(submissionData._id, responseList)
      .then( res => {
        console.log({saved: res.data});
        selectQuestion( parseInt(currentQuestionNumber) + 1 );
      });
  }


  // use this to end the submission
  const endSubmission = () => {

    alerter.confirm("You are about to submit the exam. You will no longer have access to this exam after this submission", (confirmed) => {
      if (confirmed) {
        saveList(submissionData._id, responseList)
          .then(() => {

            submit(submissionData)
              .then(() => {
                alerter.success("Great. Your exam has been submitted successfully.");
              });
          });
      }
    });
  }



  init.current = () => {

    if (params.hexstamp && params.title) {

      let link = params.hexstamp + "/" + params.title;
      getExamByLink(link)
        .then(res => {

          if (res.data && res.data.questions.length) {
            setExamData(res.data);
            setIsValidExam(true);


            // first check if the users email is already in storage
            if (localStorage.getItem("email") && localStorage.getItem("email") !== "undefined") {

              // if it is, skip the modal part and to get his/her submission data 
              let email = localStorage.getItem("email");
              setEmail(email);
              // it's a continuation and not the beginning of a submission
              retrieveSubmissionData(email, (response) => {
                // the response shouldn't return null because it's a continuation
                // but just incase it does, let's trigger the open modal for the user to enter their email
                if (response.data) {

                  setSubmissionData(response.data);

                }
                else {
                  setIsValidExam(true);

                  handleOpenModal();
                }
              });
            }
            else {
              setIsValidExam(true);

              // open the modal if no email is found in storage
              handleOpenModal();
            }

          } else {
            alerter.warning("Invalid exam link. Please check the link and try again", () => {
              setIsInitializing(false);
              setIsExamError(true);
            });
          }
        });

    }
    else {
      alerter.warning("No question was loaded to preview. This is just sample data of what a question would look like");
    }
  }




  useEffect(() => {
    if ((Object.keys(examData).length > 0) && examData._id && !examData.altered) {
      getExamQuestions(examData._id);
    }
    else if (examData.altered) {
      selectQuestion(parseInt(currentQuestionNumber));
      setIsExamReady(true);
    }

    // eslint-disable-next-line
  }, [examData]);


  useEffect(() => {
    if (questionLoaded) {
      setIsInitializing(false);
    }
  }, [questionLoaded])



  useEffect(() => {
    init.current()
  }, []);



  return (
    <>
      {!isInitializing &&
        <>

          {/* Only display this modal when the exam is valid */}
          { isValidExam &&
            <>
              <Modal className="w-100 h-100" backdrop="static" keyboard={false} show={show} onHide={handleCloseModal}>
                {/* <Modal.Header>
                  <Modal.Title>A Little Details</Modal.Title>
                </Modal.Header> */}
                <Modal.Body>
                  <h5>Set Up</h5>
                  <hr style={{ borderStyle: "dashed" }} />
                  <Form>
                    <Form.Group>
                      <Form.Label htmlFor="email" srOnly>
                        Email
                      </Form.Label>
                      <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="youremail@email.com" id="email" required />
                    </Form.Group>
                    {isNewSubmission &&
                      <>
                        <Form.Group>
                          <Form.Label htmlFor="firstname" srOnly>
                            First Name
                        </Form.Label>
                          <Form.Control value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" id="firstname" required />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label htmlFor="lastname" srOnly>
                            Last Name
                          </Form.Label>
                          <Form.Control value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" id="lastname" required />
                        </Form.Group>
                      </>
                    }

                  </Form>
                  <div className="d-flex justify-content-end">
                    <Button className="ml-auto" variant="primary" onClick={handlePrepareUser}>
                      Continue
                    </Button>
                  </div>
                </Modal.Body>
              </Modal>
            </>
          }

          { isExamReady && examData.altered && typeof currentSelectedQuestion !== "string" &&
            <>
              {/* the header */}
              <div className="exam-display-header bg-dark py-2 px-4 font-weight-bold text-muted d-flex align-items-center justify-content-between">
                <span>Question {(parseInt(currentQuestionNumber) + 1) + "/" + examData.questions.length}</span>
                <span>End Date {new Date(examData.date_published).toDateString()}</span>
              </div>

              {/* the body */}
              <div className="exam-display-body p-5 d-flex align-items-center flex-column">
                <div className="exam-display-body-container">
                  <div className="question mb-2">
                    <>
                      {
                        (() => {
                          let qObj = JSON.parse(currentSelectedQuestion.question);
                          let editorState = EditorState.createWithContent(
                            convertFromRaw(qObj)
                          );
                          let htmlcontent = tohtml(editorState.getCurrentContent());

                          return new Parser().parse(htmlcontent);
                        })()
                      }
                    </>
                  </div>

                  <div className="answer-box mb-2">
                    <Form.Control
                      value={responseList[parseInt(currentQuestionNumber)] ?
                        responseList[parseInt(currentQuestionNumber)].response : ""
                      }
                      onChange={handleChangeResponse}
                      className="p-3 border textarea" placeholder="Type your answer here..." as="textarea" autoFocus />
                  </div>

                  <div className="button-navigation d-flex justify-content-between">
                    <div>
                      <Button
                        onClick={() => selectQuestion(currentQuestionNumber - 1)}
                        disabled={(parseInt(currentQuestionNumber)) === 0}
                        variant="dark">
                        <i className='bx bxs-chevron-left'></i>
                      </Button>
                      <Button
                        onClick={() => selectQuestion(currentQuestionNumber + 1)}
                        disabled={(parseInt(currentQuestionNumber) + 1) === examData.questions.length}
                        className="ml-1"
                        variant="dark">
                        <i className='bx bxs-chevron-right'></i>
                      </Button>
                    </div>
                    {(parseInt(currentQuestionNumber) + 1) === examData.questions?.length &&
                      <Button variant="success" onClick={endSubmission}>Finish</Button>
                    }
                    {(parseInt(currentQuestionNumber) + 1) !== examData.questions?.length &&
                      <Button variant="success" onClick={submitResponseList}>Continue</Button>
                    }
                  </div>
                </div>
              </div>
            </>
          }

          {/* display this default error page */}
          { isExamError &&
            <>
              {/* the header */}
              <div className="exam-display-header bg-dark py-2 px-4 font-weight-bold text-muted">
                <span>...</span>
              </div>

              {/* the body */}
              <div className="exam-display-body p-5 d-flex align-items-center flex-column">
                <div className="exam-display-body-container">
                  <div className="question mb-2">
                    <i> could not load questions </i>
                  </div>

                  <div className="answer-box mb-2">
                    <Form.Control className="p-3 border textarea" placeholder="Type your answer here..." as="textarea" disabled />
                  </div>

                  <div className="button-navigation d-flex justify-content-between">
                    <div>
                      <Button variant="dark" disabled><i className='bx bxs-chevron-left'></i></Button>
                      <Button className="ml-1" variant="dark" disabled><i className='bx bxs-chevron-right'></i></Button>
                    </div>
                    <Button variant="success" disabled>Continue</Button>
                  </div>
                </div>
              </div>
            </>
          }

        </>
      }
    </>
  );
}