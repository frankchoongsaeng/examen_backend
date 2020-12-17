import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

// navy-blue: #1A2238, lilac: #9DAAF2, orange: #FF6A3D yellow: #F4DB7D
export default function Hompage(props) {

  let navyBlue = "#1A2238", lilac = "#9DAAF2", orange = "#FF6A3D", yellow = "#F4DB7D";
  const preNavStyle = {
    backgroundColor: yellow,
    textAlign: "center",
    padding: "10rem 0px",
    color: navyBlue
  }

  return (
    <>

      {/* Pre-Navbar */}
      <div className="px-5 before-nav" style={preNavStyle}>
        <Container>
          <h1 className="display-4">Hello, world!</h1>
          <div className="explanation-video"></div>
          <iframe
            className="d-none"
            title="what is examen"
            width="956"
            height="538"
            src="https://www.youtube.com/embed/eEzD-Y97ges"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
          <p>
            This is a simple hero unit, a simple jumbotron-style component for calling
            extra attention to featured content or information.
        </p>
          <p>
            <button variant="primary">Learn more</button>
          </p>
        </Container>
      </div>

      {/* Navbar */}
      <Navbar bg="dark" variant="dark" className="sticky-top" style={{ marginTop: "-1px" }}>
        <Navbar.Brand href="#home">
          <img
            alt=""
            src="/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          React Bootstrap
        </Navbar.Brand>
      </Navbar>


      <div>
        <h1>Hello, world!</h1>
        <p>
          This is a simple hero unit, a simple jumbotron-style component for calling
          extra attention to featured content or information.
        </p>
        <p>
          <button variant="primary">Learn more</button>
        </p>
      </div>
      <div>
        <h1>Hello, world!</h1>
        <p>
          This is a simple hero unit, a simple jumbotron-style component for calling
          extra attention to featured content or information.
        </p>
        <p>
          <button variant="primary">Learn more</button>
        </p>
      </div>
      <div>
        <h1>Hello, world!</h1>
        <p>
          This is a simple hero unit, a simple jumbotron-style component for calling
          extra attention to featured content or information.
        </p>
        <p>
          <button variant="primary">Learn more</button>
        </p>
      </div>
      <div>
        <h1>Hello, world!</h1>
        <p>
          This is a simple hero unit, a simple jumbotron-style component for calling
          extra attention to featured content or information.
        </p>
        <p>
          <button variant="primary">Learn more</button>
        </p>
      </div>
      <div>
        <h1>Hello, world!</h1>
        <p>
          This is a simple hero unit, a simple jumbotron-style component for calling
          extra attention to featured content or information.
        </p>
        <p>
          <button variant="primary">Learn more</button>
        </p>
      </div>
      <div>
        <h1>Hello, world!</h1>
        <p>
          This is a simple hero unit, a simple jumbotron-style component for calling
          extra attention to featured content or information.
        </p>
        <p>
          <button variant="primary">Learn more</button>
        </p>
      </div>
      <div>
        <h1>Hello, world!</h1>
        <p>
          This is a simple hero unit, a simple jumbotron-style component for calling
          extra attention to featured content or information.
        </p>
        <p>
          <button variant="primary">Learn more</button>
        </p>
      </div>

    </>
  )
}