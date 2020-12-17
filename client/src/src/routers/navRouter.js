import { Route, Switch, useHistory } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button'
import NewExamModal from '../components/NewExamModal';
import objectifyParam from '../util/objectify_param';
import { deleteExam } from '../util/api_service';
import switcher from '../util/switch';
import alerter from '../util/alert';

export default function NavRouter() {

  const history = useHistory();
  const searchparams = objectifyParam();

  const saveExam = () => {
    history.push("/dashboard");
  }

  const deleteCurrentExam = (e) => {
    e.preventDefault();

    alerter.confirm("are you sure you want to delete this exam? It will no longer be available.", (confirmation) => {
      if (confirmation) {
        if (searchparams.id) {
          deleteExam(searchparams.id)
            .then(res => {
              switcher(res.status, () => {
                alerter.success("Exam deleted", () => history.push("/dashboard"));
              });
            })
        } 
        else {
          alerter.error("This is embarrasing. we're having issues finding the exam you want to delete please save your work, go back to you dashboard and try again.")
        }
      }
    })
  }

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    history.push("/")
  }

  return (
    <Switch>
      <Route exact path="/edit">

        <Nav.Item>
          <Nav.Link>
            <Button onClick={saveExam} variant="primary" className="btn-sm d-flex px-4">
              {/* <i style={{ fontSize: "150%" }} className='bx bx-check-double m-0 pr-1'></i> Done */}
               Done
              </Button>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link>
            <Button variant="success" className="btn-sm d-flex px-4">
              {/* <i style={{ fontSize: "150%" }} className='bx bx-check-double m-0 pr-1'></i> Publish */}
              Publish
              </Button>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link>
            <Button onClick={deleteCurrentExam} variant="danger" className="btn-sm d-flex px-4 align-items-center">
              {/* <i style={{ fontSize: "120%" }} className='bx bx-error m-0 pr-1'></i> Discard Exam */}
              Discard Exam
              </Button>
          </Nav.Link>
        </Nav.Item>
      </Route>
      <Route path="/">
        <Nav.Item>
          <Nav.Link>
            <NewExamModal />
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link>
            <Button variant="danger" className="btn-sm" onClick={handleLogout} >
              Logout
            </Button>
          </Nav.Link>
        </Nav.Item>
      </Route>
    </Switch>
  );
}
