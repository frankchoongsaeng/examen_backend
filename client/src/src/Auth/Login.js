import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import alerter from '../util/alert';
// import { login } from './controllers/login_controller';
import { login } from '../util/api_service';

import './styles/login.css';
import switcher from '../util/switch';


export default function Login(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const history = useHistory();


  const handleInputChange = ({ target }) => {
    target.type === "email" ? setEmail(target.value) : setPassword(target.value)
  }

  const handleLogin = (e) => {
    e.preventDefault();
    setIsRequesting(true);

    login({ email, password }).then(res => {
      setIsRequesting(false);
      switcher(res.status, () => {
        localStorage.setItem("token", res.data.token);
        alerter.success("account created successfully", () => {
          // history.push("/dashboard");
          history.go(0);
        });
      });
    });
    // (status, tokenData) => {

    //   setIsRequesting(false);

    //   if (status === 201 || status === 200) {
    //     console.log(tokenData)
    //     localStorage.setItem("token", tokenData.token);
    //     alerter.success("account created successfully", () => {
    //       history.push("/dashboard");
    //     });
    //   }

    //   else if (status === 400) {
    //     alerter.error("please provide a valid email and provide a password");
    //   }

    //   else if (status === 401) {
    //     alerter.error("Incorrect password");
    //   }

    //   else if (status === 404) {
    //     alerter.error("It seems that email has not been registered yet, try signing up instead");
    //   }

    //   else if (status === 408) {
    //     alerter.error("Unable to connect. Please check your internet connection and try again");
    //   }

    //   else if (status === 500) {
    //     alerter.error("Something bad has occurred and the experts are working hard to fix this. Please try again after som time");
    //   }

    //   else {
    //     alerter.warning("An unknow error occurred");
    //   }
    // })
  }

  return (
    <div className="col-md-6 bg-purple form-container d-flex justify-content-center align-items-center py-5">
      <div>
        <Form className="form">
          <h2 className="text-center mb-5">Login</h2>
          <Form.Group>
            <Form.Control type="email" id="email" placeholder="email" value={email} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group>
            <Form.Control type="password" id="password" placeholder="password" value={password} onChange={handleInputChange} />
          </Form.Group>
          <Button className="mt-4" onClick={handleLogin} block>
            {isRequesting &&
              "Please wait..."
            }
            {!isRequesting &&
              "Sign In"
            }
          </Button>
        </Form>
        <p className="d-block mt-5 text-center">Don't have an account? <Link className="font-italic" to="/signup">Signup here</Link></p>
      </div>
    </div>
  );
}
