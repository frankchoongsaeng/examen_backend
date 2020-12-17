import React from 'react';
import Form from 'react-bootstrap/Form';
// import  from 'react-bootstrap/Form';

export default function Question({ number, question, objective, type, options }) {
  return (
    <div className="d-flex flex-column">
      <div className="number">
        <h1>Question { number }</h1>
      </div>
      <div className="question">
        { question }
      </div>
      { objective && 
        <div className="question-response">
          { options.map( (val, ind) => 
              <div key={ind} className="mb-3">
                <Form.Check name={number} type={type} id={`check-api-${type}`}>
                  <Form.Check.Input type={type} />
                  <Form.Check.Label>{ question }</Form.Check.Label>
                </Form.Check>
              </div>
            )
          }
        </div>
      }
      { !objective &&
        <div className="question-response">
          { question }
        </div>
      }
    </div>
  );
}