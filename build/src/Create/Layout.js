import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import NewQuestion from './NewQuestion';
import AppHeader from '../components/AppNav';
import switcher from '../util/switch';
import useSearchParam from '../util/objectify_param';
import { saveQuestion, getExamQuestions, saveQuestionToExam } from '../util/api_service';
import './styles/index.css';


/**
 * remove an item from a list at a specific index and return the new list 
 * and the next item that should be selected after the removal has been made 
 * @param {array} list the array list that the item will be removed from
 * @param {number} index index of the item which you want to remove from the list
 */
function deleteFromList(list, index) {
  let newList = [...list];
  let selectNext = list[index];

  // should not be able to delete 
  // all questions from an exam
  if (newList.length > 0) {
    newList.splice(index, 1);

    if (index === newList.length) {
      selectNext = newList[newList.length - 1];
    } else {
      selectNext = newList[index];
    }
  }

  return [[...newList], selectNext];
}

/**
 * add an item to a list after a specific index and return the new list 
 * and the next item that should be selected after the addition has been made 
 * @param {array} list the array list that the item will be added to
 * @param {number} addAfter the item in the list after which you want to add the new item
 */
function addToList(list, addAfter, id) {
  let newList = [...list];
  let startIndex = list.indexOf(addAfter) + 1;

  newList.splice(startIndex, 0, id); //  add the nextNum after the addAfter variable

  // select the newly added item next
  let selectNext = newList[startIndex];

  return [[...newList], selectNext];
}


export default function Create() {

  const [isInitializing, setIsInitializing] = useState(true);
  const [questionList, setQuestionList] = useState([]);
  const [currentSelectedItem, setCurrentSelectedItem] = useState();
  const init = useRef();
  const history = useHistory();

  const searchParam = useSearchParam();

  const addQuestion = (id) => {
    // if (questionList.length === 0) {
    //   alert("empty list, clicking the button has no effect");
    //   return;
    // }

    let [newList, selectNext] = addToList(questionList, currentSelectedItem, id);
    setQuestionList(newList);
    setCurrentSelectedItem(selectNext);
  }

  // save a question, this could cause the create of a question
  // or the update of a question depending on if it exists
  const createNewQuestion = () => {
    saveQuestion({ examId: searchParam.id })
      .then(res => {
        switcher(res.status, () => {
          addQuestion(res.data._id);
        });
      });
  }

  const handleDelete = (index) => {
    let [newList, selectNext] = deleteFromList(questionList, index);
    setCurrentSelectedItem(selectNext);
    setQuestionList(newList);

    // save the question list to the current exam
    saveQuestionToExam({
      examId: searchParam.id,
      questionList: JSON.parse(localStorage.getItem("questionlist"))
    }).then(res => {
      switcher(res.status, () => {
        console.log(res.data);
      });
    });
  }

  // initialize the Create/Edit question component
  // this function should only run once, and at componentDidMount
  init.current = () => {

    if (searchParam.action && searchParam.action === "create") {

      // if the current route has an action set to create
      // in it's query param, then create a new question
      let data = {};
      data.examId = searchParam.id;
      saveQuestion(data)
        .then(res => {
          switcher(res.status, () => {
            addQuestion(res.data._id);

            // save the question list to the current exam
            saveQuestionToExam({
              examId: searchParam.id,
              questionList: JSON.parse(localStorage.getItem("questionlist"))
            }).then(res => {
              switcher(res.status, () => {
                console.log(res.data);
                history.replace(`/edit?id=${searchParam.id}&action=modify`);
                setIsInitializing(false);
              });
            });
          });
        });

    }
    else if (searchParam.action && searchParam.action === "modify") {

      // if the current route has an action set to modify
      // in it's query param, then query the database 
      // for the questions belonging to this exam.
      getExamQuestions(searchParam.id)
        .then(res => {
          switcher(res.status, () => {
            setQuestionList(res.data);
            setCurrentSelectedItem(res.data[0]);
            setIsInitializing(false);
          })
        });

    }
    else {
      // if the user is not editing an exam or creating one,
      // then i don't know what they think they are here for

      // do something...

    }

  }

  // set up useEffect to track whenever the questionList changes 
  // and save it to local storage
  useEffect(() => {

    // save the current questionList to storage so that it is 
    // accessible to all questions and can be saved from each question. 
    // the reason for this is to improve performance by reducing re-renders
    localStorage.setItem("questionlist", JSON.stringify(questionList));
  }, [questionList]) 

  // mimmick componentDidMount without blocking
  // a visual feedback to the user 
  useEffect(() => {
    init.current();
  }, []);


  return (
    <>
      {/* This is the loading bar that shows while we're doing initial setup */}
      {/* We are hiding this as soon as we're ready with data */}
      { isInitializing &&
        <div style={{
          backgroundColor: "#eeeeee66",
          position: "fixed",
          zIndex: "9999",
          width: "100vw",
          height: "100vh"
        }} className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      }



      {/* Here's the panel that actually gets displayed */}
      {/* Let's not render the panel till we're ready with all the data */}
      { !isInitializing &&
        <div style={{ height: "100vh", overflowY: "hidden" }}>
          <AppHeader />
          <Tab.Container id="left-tabs-example" onSelect={(ek) => { setCurrentSelectedItem(ek) }} activeKey={currentSelectedItem}>
            <Row>
              <Col className="left-pane p-0" sm={3}>
                <div className="bg-dark full-height overflow-auto">
                  <Nav variant="pills" className="flex-column pb-5 mb-5">

                    {
                      questionList.map((questionId, index) => {
                        return (
                          <Nav.Item key={questionId}>
                            <Nav.Link className="question-list-item" eventKey={questionId}  >Question {index + 1}.</Nav.Link>
                          </Nav.Item>
                        );
                      })
                    }

                    <div onClick={createNewQuestion} className="bg-info p-2 font-weight-bolder text-white d-flex justify-content-center align-items-center add-question-btn">
                      <i className='bx bxs-add-to-queue mr-2'></i> Add Question
                    </div>
                  </Nav>
                </div>
              </Col>
              <Col sm={9} className="p-0">
                <div className="full-height bg-light right-pane">
                  <Tab.Content >

                    {
                      questionList.map((questionId, index) => {
                        return (
                          <Tab.Pane eventKey={questionId} key={questionId} >
                            <div className="question-box">
                              <NewQuestion questionId={questionId} position={index} onDelete={handleDelete} />
                            </div>
                          </Tab.Pane>
                        )
                      })
                    }

                  </Tab.Content>
                </div>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      }

    </>
  );
}

