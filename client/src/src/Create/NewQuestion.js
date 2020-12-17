import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import TabContent from 'react-bootstrap/TabContent';
import TabPane from 'react-bootstrap/TabPane';
import Nav from 'react-bootstrap/Nav';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import swal from 'sweetalert';
import alerter from '../util/alert';
import { Editor } from 'react-draft-wysiwyg';
import RichEditor from './Editor';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import switcher from '../util/switch';
import useSearchParam from '../util/objectify_param';
import { getQuestion, saveQuestion, saveQuestionToExam, deleteQuestion as deletequestion } from '../util/api_service';



/**
 * 
 * @TODO - make the editor uncontrolled so that it responds faster
 * @TODO - allow add objective type questions
 */
export default function NewQuestion({ questionId, onDelete, position }) {

  const searchparam = useSearchParam();
  const question = useRef({});
  const init = useRef();

  // component states
  const [isObjective, setIsObjective] = useState();
  const [options, setOptions] = useState();
  const [isSaved, setIsSaved] = useState();
  const [isInitializing, setIsInitializing] = useState();

  // save this question
  const saveCurrentQuestion = () => {
    // save the question to the database
    saveQuestion({
      _id: questionId,
      examId: searchparam.id,
      questionType: isObjective ? "objective" : "subjective",
      question: JSON.stringify(question.current),
    }).then(res => {

      switcher(res.status, () => {
        setIsSaved((true))
        console.log(res.data);
      });
    });

    // save the question list to the current exam
    saveQuestionToExam({
      examId: searchparam.id,
      questionList: JSON.parse(localStorage.getItem("questionlist"))
    }).then(res => {
      switcher(res.status, () => {
        console.log(res.data);
      });
    });
  };

  // preview this question
  const previewQuestion = () => {
    let questiondata = {
      question: question.current,
      questionNumber: position + 1,
      questionId,
    }
    localStorage.setItem("previewquestiondata", JSON.stringify(questiondata));
    window.open("/session/preview-question", "_blank", );
  }

  // update the question ref with the new question object
  const updateQuestion = (newQuestion) => {
    question.current = newQuestion;
    setIsSaved(false);
  }

  // reset question state to original
  const resetQuestion = () => {
    question.current = {};
    setIsObjective(false);
  };

  // delete this question
  const deleteQuestion = () => {
    alerter.confirm("Are you sure you want to delete this question?", confirmed => {
      if (confirmed) {
        deletequestion(questionId)
          .then(res => {
            switcher(res.status, () => {
              onDelete(position)
            });
          })
      }
    });
  };



  // initailize the current exam variable for each question 
  // this enables the question know which exam it belongs to
  init.current = () => {

    if (questionId) {
      // questionId must be provided before the
      // content of this component is allowed to mount 

      if (searchparam.action && searchparam.action === "modify") {

        // {"blocks":[{"key":"95sqp","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}

        // load up the question from the database 
        // if the user currently editing this exam 
        getQuestion(questionId)
          .then(res => {
            // console.log({status: res.state, questionData});
            if (res.data && res.data.question) {
              console.log({ data: res.data });

              question.current = JSON.parse(res.data.question);
              console.log({ question: question.current });
              setIsObjective(res.data.questionType === "objective");
              setIsSaved(true);
              setIsInitializing(false);
            }
            else {
              question.current = {
                "blocks": [{
                  "key": "95sqp",
                  "text": "",
                  "type": "unstyled",
                  "depth": 0,
                  "inlineStyleRanges": [],
                  "entityRanges": [],
                  "data": {}
                }],
                "entityMap": {}
              }

              setIsObjective(false);
              setIsSaved(true);
              setIsInitializing(false);
            }
          });

      }
      else {

        // the user is not doing an edit
        // initialize a new question
        question.current = {
          "blocks": [{
            "key": "95sqp",
            "text": "",
            "type": "unstyled",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {}
          }],
          "entityMap": {}
        }

        setIsObjective(false);
        setIsSaved(true);
        setOptions(EditorState.createEmpty());
        setIsSaved(true);
        setIsInitializing(() => false);
      }

    }
    else {
      // saveQuestion();
      alerter.warning("question did not load successfully");
    }
  }


  // set isSaved to false whenever a state changes
  useEffect(() => {
    setIsSaved(issaved => issaved ? false : issaved);
  }, [isObjective, options, question])



  // mimmick componentDidMount without blocking
  // a visual feedback to the user 
  useEffect(() => {
    init.current();
    return( () => {
      localStorage.removeItem("previewquestiondata");
    });
  }, [])

  return (

    <div className="new-question">
      { isInitializing &&
        <div className="d-flex  w-100 h-100 justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      }
      { !isInitializing &&
        <>
          { Object.keys(question.current).length > 0 &&
            <RichEditor initialState={question.current} onFocusLost={updateQuestion} />
          }

          <Form.Text className="text-muted text-right pr-5">
            use this editor to create your question
          </Form.Text>

          <hr />


          <div className="px-3">
            <Form.Group controlId={`question${position}isObjective`}>
              <Form.Check
                label="Objective"
                checked={isObjective}
                onClick={sw_alert}
                onChange={(e) => setIsObjective(false)}
              />
              <Form.Text className="text-muted">
                Check this box if you want this question to have an objective-type answer
            </Form.Text>
            </Form.Group>
          </div>


          {
            isObjective &&
            <>
              <hr className="mb-0" />

              <Row>

                <Col className="pt-2" sm={3}>
                  <Form.Group controlId="canChooseMultiple">
                    <Form.Check
                      label="Select Multiple"
                    />
                    <Form.Text className="text-muted">
                      Allow examinee to select multiple choices, leaving this unchecked will set this question as select only one
                  </Form.Text>
                  </Form.Group>
                </Col>

                <Col className="answer-options-tab-left" sm={9}>
                  <Tab.Container id="answer-options-tab" defaultActiveKey="options-answer-1">
                    <Row className="pt-0">
                      <Col className="bg-dark p-0" sm={3}>
                        <Nav variant="pills" className="flex-column">
                          <Nav.Item>
                            <Nav.Link className="answer-option-listitem d-flex justify-content-between  align-items-center" eventKey="options-answer-1">Option 1 <i className='align-self-end bx bxs-x-square'></i></Nav.Link>
                          </Nav.Item>

                          <Nav.Item>
                            <Nav.Link className="answer-option-listitem" eventKey="options-answer-2">Option 2</Nav.Link>
                          </Nav.Item>
                        </Nav>

                      </Col>
                      <Col className="answer-options-tab-right" sm={9}>
                        <TabContent>
                          <TabPane eventKey="options-answer-1">
                            <Editor
                              toolbarClassName="toolbarClassName"
                              wrapperClassName="wrapperClassName"
                              editorClassName="newQuestionAnswerEditor"
                              editorState={options}
                              onEditorStateChange={(editorState) => setOptions(editorState)}
                            />
                          </TabPane>
                        </TabContent>
                      </Col>
                    </Row>
                  </Tab.Container>
                </Col>

              </Row>
            </>
          }

          <div className="col-sm-9 ml-auto d-flex justify-content-center align-content-center fixed-bottom pb-3">
            <div className="action-bar bg-dark">


              {/* The save button for each question */}
              <OverlayTrigger
                key="save"
                placement="top"
                delay="500"
                overlay={
                  <Tooltip id={`tooltip-save`}>
                    {isSaved && <strong>Saved!</strong>}
                    {!isSaved && <strong>save question</strong>}
                  </Tooltip>
                }
              >
                <span style={{ cursor: isSaved ? 'default' : 'pointer' }} onClick={!isSaved ? saveCurrentQuestion : () => { }} className={`action-button text-${isSaved ? 'white-50 disabled' : 'white'}`}><i className='bx bxs-save'></i></span>
              </OverlayTrigger>


              {/* The preview button for each question */}
              <OverlayTrigger
                key="preview"
                delay="500"
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-preview`}>
                    <strong>preview question</strong>.
                  </Tooltip>
                }
              >
                {/* <Link to="/exam-preview" target="_blank" className="action-button text-white" ><i className='bx bx-link-external' ></i></Link> */}
                <span onClick={previewQuestion} className="action-button text-white" ><i className='bx bx-link-external' ></i></span>
              </OverlayTrigger>


              {/* The reset button for each question */}
              <OverlayTrigger
                key="reset"
                delay="500"
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-reset`}>
                    <strong>reset question</strong>.
                  </Tooltip>
                }
              >
                <span onClick={resetQuestion} className="action-button text-white" ><i className='bx bx-reset'></i></span>
              </OverlayTrigger>


              {/* The delete button for each question */}
              <OverlayTrigger
                key="delete"
                delay="500"
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-delete`}>
                    <strong>delete question</strong>.
                  </Tooltip>
                }
              >
                <span onClick={deleteQuestion} className="action-button text-white delete" ><i className='bx bxs-trash' ></i></span>
              </OverlayTrigger>


            </div>
          </div>
        </>
      }
    </div >
  );
}


function sw_alert({ children }) {
  const responses = [
    "Our team is working hard to bring that functionality to you",
    "We won't rest until you get the functionality you deserve!",
    "You've found what's coming your way next!"
  ]
  swal({
    title: "Hey!",
    text: responses[Math.floor(Math.random() * responses.length)],
    button: {
      text: "Okay, got it.",
      className: "btn-primary btn-block sw-btn"
    }
  });
}