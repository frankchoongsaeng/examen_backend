import Container from 'react-bootstrap/Container';
import SessionRouter from '../routers/sessionRouter'; 

export default function Layout() {

  return (
    <div className="exam-page">
      <Container>
        <div className="d-flex h-100 justify-content-center align-items-center">

          <div className="exam-display w-100 bg-light rounded">

            <SessionRouter />

          </div>

        </div>
      </Container>
    </div>
  );
}