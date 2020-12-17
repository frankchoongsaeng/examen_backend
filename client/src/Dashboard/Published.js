import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';
import alerter from '../util/alert';
import switcher from '../util/switch';
import { getPublishedExams, deleteExam } from '../util/api_service';
import { CopyToClipboard as Copy } from 'react-copy-to-clipboard'

export default function Published() {

  const [examList, setExamList] = useState([]);
  const [modalState, setModalState] = useState({ show: false, data: {} });


  const handleLaunchModal = (exam) => {
    setModalState({ data: exam, show: true });
  }

  const handleClose = () => {
    setModalState(cState => ({ ...cState, show: false }));
  }

  const triggerDeleteExam = ({ _id: id, ...data }) => {
    alerter.confirm(`Permently delete ${data.title}`, confirmation => {
      if (confirmation) {
        deleteExam(id)
          .then(res => {
            switcher(res.status, () => {
              alerter.success("exam deleted successfully");
              callGetExams();
            });
          });
      }
    });
  }

  const callGetExams = () => {
    getPublishedExams()
      .then((res) => {
        switcher(res.status, () => {
          console.log(res.data || false);
          setExamList(res.data);
        });
      });
  }


  useEffect(() => {
    callGetExams();
  }, [])


  return (
    <>
      <div className="my-3 d-flex flex-wrap">

        <>
          <Modal show={modalState.show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <div className="d-flex flex-wrap">

                <h5 className="w-100 ">
                  {modalState.data.title}
                </h5>

                <p className="mb-2 text-muted mt-3">
                  <span className="badge badge-secondary">Created</span>
                  <br /> {new Date(modalState.data.created).toDateString()}
                </p>

                <p className="mb-2 text-muted ml-3 mt-3 pl-3 border-left">
                  <span className="badge badge-secondary">published</span>
                  <br /> {new Date(modalState.data.date_published).toDateString()}
                </p>

                <p className="mb-2 text-muted ml-3 mt-3 pl-3 border-left">
                  <span className="badge badge-secondary">Status</span>
                  <br /> {modalState.data.published ? 'Ongoing' : 'Finished'}
                </p>

                {/* Form Group that holds the link and the copy button */}
                <Form.Group className="mt-3 w-100">
                  <Form.Label htmlFor="link" srOnly>
                    exam link
                  </Form.Label>
                  <InputGroup className="mb-2">
                    <Copy title="Copy Link"  text={window.location.hostname + ":" + window.location.port + "/session/" + modalState.data.link}>
                      <FormControl className="btn btn-outline-primary" style={{ cursor: "pointer" }} id="link" value={window.location.hostname + ":" + window.location.port + "/session/" + modalState.data.link} disabled />
                    </Copy>
                    <InputGroup.Append style={{ cursor: "pointer" }}>
                      <Copy title="Copy Link" text={window.location.hostname + ":" + window.location.port + "/session/" + modalState.data.link}>
                        <Button><i className="bx bxs-copy"></i></Button>
                      </Copy>
                    </InputGroup.Append>
                  </InputGroup>
                  <Form.Text className="text-muted font-italic">copy this exam and send it to people who will be taking your exams</Form.Text>
                </Form.Group>

              </div>

            </Modal.Body>
          </Modal>
        </>

        {
          examList.map(exam => {
            let created = new Date(exam.created).toDateString(),
              published = new Date(exam.date_published).toDateString(),
              expires = new Date(exam.expires).toDateString();

            return (
              <Card key={exam._id} className="mb-3 mx-1" style={{ width: '24%' }}>
                <Card.Body>
                  <h5 className="d-flex justify-content-between align-items-center">
                    {exam.title} <span className="btn btn-sm btn-secondary"><i className='bx bx-reply' ></i></span>
                  </h5>

                  <hr />

                  <p className="mb-0 text-muted">
                    <span className="badge badge-secondary">Created</span> {created}
                  </p>
                  <p className="mb-0 text-muted">
                    <span className="badge badge-secondary">published</span> {published}
                  </p>
                  <p className="mb-0 text-muted">
                    <span className="badge badge-secondary">Status</span> {expires}
                  </p>



                  <div className="mt-3 d-flex">
                    <Button onClick={() => handleLaunchModal(exam)} variant="primary" ><i className='bx bxs-show' ></i></Button>
                    <Button className="ml-1" onClick={() => triggerDeleteExam(exam)} variant="danger"  ><i className='bx bxs-trash' ></i></Button>
                  </div>

                </Card.Body>
              </Card>
            )
          })
        }

      </div>
    </>
  )
}

