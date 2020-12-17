import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import alerter from '../util/alert';
import switcher from '../util/switch';
import { getDraftExams, getExam, deleteExam, publishExam as publish } from '../util/api_service';

export default function Drafts() {

  const [examList, setExamList] = useState([]);
  const history = useHistory();


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


  const publishExam = (exam) => {
    alerter.confirm("Are you sure you want to publish this exam? It will no longer be editable", (confirmed) => {
      if(confirmed) {
        publish(exam._id, exam)
        .then(res => {
          switcher(res.status, () => {
            let link = window.location.hostname + ":" + window.location.port + "/session/" + res.data.link;
            let parsedHTML = `Exam published successfully. send this ${link} to anyone you want to take this exam. You can always find the exam or link under the "Published Exams" tab`;
            console.log(parsedHTML);
            alerter.success(parsedHTML);
            return callGetExams();
          });
        })
      }
    });
  }


  const editExam = (exam) => {
    getExam(exam._id)
      .then(res => {
        switcher(res.status, () => {
          history.push(`/edit?id=${exam._id}&action=modify`);
        });
      });
  }


  const callGetExams = () => {

    getDraftExams()
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

        {
          examList.map(exam => {
            let created = new Date(exam.created).toDateString(),
              modified = new Date(exam.modified).toDateString();

            return (
              <Card key={exam._id} className="mb-3 mx-1" style={{ width: '24%' }}>
                <Card.Body>
                  <h5 className="d-flex justify-content-between align-items-center">
                    {exam.title}
                  </h5>

                  <hr />
                  <p className="mb-0 text-muted">
                    <span class="badge badge-secondary">created</span> {created}
                  </p>
                  <p className="mb-0 text-muted">
                    <span class="badge badge-secondary">modified</span> {modified}
                  </p>
                  <div className="mt-3 d-flex">
                    <Button onClick={() => editExam(exam)} variant="primary" >
                      <i className='bx bxs-edit' ></i>
                    </Button>
                    <Button className="ml-1" onClick={() => publishExam(exam)} variant="success">
                      <i className='bx bxs-cloud-upload' ></i>
                    </Button>
                    <Button className="ml-1 " onClick={() => triggerDeleteExam(exam)} variant="danger" >
                      <i className='bx bxs-trash' ></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            );
          })
        }

      </div>
    </>
  )
}
