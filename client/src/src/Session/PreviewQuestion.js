import { useEffect, useRef, useState } from 'react';
import { EditorState, convertFromRaw } from 'draft-js';
import { stateToHTML as tohtml } from 'draft-js-export-html';
import { Parser } from 'html-to-react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import alerter from '../util/alert';

export default function Layout() {

  const [questionData, setQuestionData] = useState();
  const [questionDataLoaded, setQuestionDataLoaded] = useState(false)
  const init = useRef();

  init.current = () => {
    let qData = localStorage.getItem("previewquestiondata");
    if (qData && qData !== "undefined") {

      qData = JSON.parse(qData);

      let editorState = EditorState.createWithContent(
        convertFromRaw(qData.question)
      );

      let htmlcontent = tohtml(editorState.getCurrentContent())

      qData.question = htmlcontent;

      setQuestionData(qData);
      setQuestionDataLoaded(true);
    }
    else {
      alerter.warning("No question was loaded to preview. This is just sample data of what a question would look like");
    }
  }

  useEffect(() => {
    init.current()
  }, []);

  return (
    <>
      {questionDataLoaded &&
        <>
          {/* the header */}
          <div className="exam-display-header bg-dark py-2 px-4 font-weight-bold text-muted">
            <span>Question {questionData.questionNumber}/..</span>
          </div>

          {/* the body */}
          <div className="exam-display-body p-5 d-flex align-items-center flex-column">
            <div className="exam-display-body-container">
              <div className="question mb-2">
                <> {new Parser().parse(questionData.question)} </>
              </div>

              <div className="answer-box mb-2">
                <Form.Control className="p-3 border textarea" placeholder="Type your answer here..." as="textarea" autoFocus />
              </div>

              <div className="button-navigation d-flex justify-content-between">
                <div>
                  <Button variant="dark"><i className='bx bxs-chevron-left'></i></Button>
                  <Button className="ml-1" variant="dark"><i className='bx bxs-chevron-right'></i></Button>
                </div>
                <Button variant="success">Confirm</Button>
              </div>
            </div>
          </div>
        </>
      }

      {!questionDataLoaded &&
        <>
          {/* the header */}
          <div className="exam-display-header bg-dark py-2 px-4 font-weight-bold text-muted">
            <span>Question 1/10</span>
          </div>

          {/* the body */}
          <div className="exam-display-body p-5 d-flex align-items-center flex-column">
            <div className="exam-display-body-container">
              <div className="question mb-2">
                <p>True/false questions are only composed of a statement. Students respond to the questions by indicating whether the statement is true or false. For example: True/false questions have only two possible answers (Answer: True).</p>
              </div>

              <div className="answer-box mb-2">
                <Form.Control className="p-3 border textarea" placeholder="Type your answer here..." as="textarea" autoFocus />
              </div>

              <div className="button-navigation d-flex justify-content-between">
                <div>
                  <Button variant="dark"><i className='bx bxs-chevron-left'></i></Button>
                  <Button className="ml-1" variant="dark"><i className='bx bxs-chevron-right'></i></Button>
                </div>
                <Button variant="success">Confirm</Button>
              </div>
            </div>
          </div>
        </>
      }

    </>
  );
}