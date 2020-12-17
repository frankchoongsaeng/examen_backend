// import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
// import Form from 'react-bootstrap/Form';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
// // import Modal from '/CustomModal';
// import alerter from '../../util/alert';
// import switcher from '../../util/switch';
// import { createExam } from '../../util/api_service';


// /**
//  * @todo exam modal should not invoke a popup. overlapping modals or popups are a bad practice
//  */
// export default function NewExamModal() {

//   const [title, setTitle] = useState();
//   const [isTimed, setIsTimed] = useState(false);
//   const [hours, setHours] = useState(0);
//   const [minutes, setMinutes] = useState(0);
//   const [expires, setExpires] = useState(new Date());
//   // const [expires, setExpires] = useState();
//   const [isRequesting, setIsRequesting] = useState(false);
//   const [, setIsRequestError] = useState(false);


//   const history = useHistory();

//   // toggle check and uncheck state 
//   const handleCheck = (e) => {
//     console.dir(e)
//     setIsTimed(e.target.checked);
//   }

//   const handleCreateNewExam = () => {
//     setIsRequesting(true);
//     let examData = { title, isTimed, hours, minutes, expires };

//     createExam(examData)
//       .then(res => {
//         switcher(res.status, () => {
//           setIsRequestError(false);

//           alerter.success("exam created successfully", () => {
//             history.push(`/edit?id=${res.data.response._id}&action=create`);
//           });
//         });
//       })

//   }

//   return (
//     <Modal
//         show={show}
//         onHide={handleClose}
//         backdrop="static"
//         keyboard={false}
//       >

//       <Button variant="primary" onClick={handleShow}>
//         Launch static backdrop modal
//       </Button>

      
//         <Modal.Header closeButton>
//           <Modal.Title>Modal title</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           I will not close if you click outside me. Don't even try to press
//           escape key.
        





//         <Form>
//           <Form.Group>
//             <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Exam Title" />
//           </Form.Group>

//           <hr />

//           <Form.Group controlId="formBasicPassword">
//             <Form.Check
//               label="Create a timed exam"
//               checked={isTimed}
//               onChange={handleCheck}
//             />
//             <Form.Text className="text-muted">
//               Check this box if you want to set an exam with a fixed duration: example 3 hours 25 minutes
//           </Form.Text>
//           </Form.Group>

//           {isTimed &&
//             <Row>
//               <Col>
//                 <Form.Group className="d-flex align-items-center mx-2 mt-2" controlId="formBasicCheckbox">
//                   <Form.Label>Hour(s): </Form.Label>
//                 </Form.Group>
//               </Col>
//               <Col>
//                 <Form.Group controlId="formBasicCheckbox">
//                   <Form.Control type="number" value={hours} onChange={(e) => { setHours(e.target.value) }} max="18" min="0" />
//                 </Form.Group>
//               </Col>
//               <Col>
//                 <Form.Group className="d-flex align-items-center mx-2 mt-2" controlId="formBasicCheckbox">
//                   <Form.Label>Minute(s): </Form.Label>
//                 </Form.Group>
//               </Col>
//               <Col>
//                 <Form.Group controlId="formBasicCheckbox">
//                   <Form.Control type="number" value={minutes} onChange={(e) => { setMinutes(e.target.value) }} max="59" min="0" />
//                 </Form.Group>
//               </Col>
//             </Row>
//           }

//           <hr />

//           <Row>
//             <Col>
//               <Form.Group className="d-flex align-items-center mx-2 mt-2" controlId="formBasicCheckbox">
//                 <Form.Label>Exam expires: </Form.Label>
//               </Form.Group>
//             </Col>
//             <Col>
//               <Form.Group controlId="formBasicCheckbox">
//                 <Form.Control type="date" value={expires} onChange={(e) => { setExpires(e.target.value); console.log(typeof e.target.value) }} />
//               </Form.Group>
//             </Col>
//           </Row>

//         </Form>
          
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary">Understood</Button>
//         </Modal.Footer>
//     </Modal>
//   );
// }