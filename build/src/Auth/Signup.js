import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
// import { signup } from './controllers/signup_controller';
import { signup } from '../util/api_service';
import alerter from '../util/alert';

import './styles/login.css';
import switcher from '../util/switch';

export default function Signup() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organizationCheck, setOrganizationCheck] = useState(false);
  const [organizationName, setOrganizationName] = useState("select an organization...");
  const [organizationPosition, setOrganizationPosition] = useState("");
  const [tosAgreement, setTosAgreement] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const history = useHistory();

  

  const setStates = {
    "first-name": setFirstName,
    "last-name": setLastName,
    "phone": setPhone,
    "email": setEmail,
    "password": setPassword,
    "confirm-password": setConfirmPassword,
    "organization-check": setOrganizationCheck,
    "organization-select": setOrganizationName,
    "organization-position": setOrganizationPosition,
    "terms-and-condition": setTosAgreement
  }

  const handleInputChange = ({ target }) => {
    setStates[target.id](target.value);
  }

  const handleInputChecked = ({ target }) => {
    setStates[target.id](target.checked);
  }


  function handleSignup (e){
    e.preventDefault();
    setIsRequesting(true)
    
    const userdata = {
      "firstName": firstName,
      "lastName": lastName,
      "phone": phone,
      "email": email,
      "password": password,
      "confirmPassword": confirmPassword,
      "withOrg": organizationCheck,
      "organization": organizationName,
      "position": organizationPosition,
      "tosAgreement": tosAgreement
    }


    signup(userdata)
    .then( res => {
      switcher(res.status, () => {
        localStorage.setItem("token", res.data.token);
        alerter.success("account created successfully", () => {
          history.push("/dashboard");
        });
      });
    });

    // signup(userdata, (status, tokenData) => {
    //   setIsRequesting(false);
      
    //   if(status === 201 || status === 200 ) {
    //     console.log(tokenData)
    //     localStorage.setItem("token", tokenData.token);
    //     alerter.success("account created successfully", () => {
    //       history.push("/dashboard");
    //     });
    //   }
      
    //   else if(status === 400) {
    //     alerter.warning("some fields are empty or contain unreal data, please fix that and try again");
    //   }
      
    //   else if(status === 408) {
    //     alerter.error("Unable to connect. Please check your internet connection and try again");
    //   }
      
    //   else if(status === 409) {
    //     alerter.error("That email already exists. You should consider signing in instead.");
    //   }
      
    //   else if(status === 500) {
    //     alerter.error("Something bad has occurred and the experts are working hard to fix this. Please try again after som time");
    //   }
      
    //   else {
    //     alerter.warning("An unknow error occurred");
    //   }
      
    // });
  }

  return (
    <div className="col-md-6 bg-purple form-container d-flex justify-content-center py-5">
      <div>
        <Form className="form">
          <h2 className="text-center mb-5">Let's get you started</h2>


          <Form.Group>
            <Form.Control type="text" id="first-name" placeholder="First Name" value={firstName} onChange={handleInputChange} />
          </Form.Group>

          <Form.Group>
            <Form.Control type="text" id="last-name" placeholder="Last Name" value={lastName} onChange={handleInputChange} />
          </Form.Group>


          <Form.Group>
            <Form.Control type="phone" id="phone" placeholder="0202005000" value={phone} onChange={handleInputChange} />
          </Form.Group>

          <Form.Group>
            <Form.Control type="email" id="email" placeholder="youremail@mail.com" value={email} onChange={handleInputChange} />
          </Form.Group>

          <Form.Group>
            <Form.Control type="password" id="password" placeholder="password" value={password} onChange={handleInputChange} />
          </Form.Group>

          <Form.Group>
            <Form.Control type="password" id="confirm-password" placeholder="confirm password" value={confirmPassword} onChange={handleInputChange} />
          </Form.Group>

          <hr />

          <Form.Group className="mr-auto" >
            <Form.Check
              className="mr-auto"
              type="checkbox"
              label="I want to register as part of an institute"
              id="organization-check"
              checked={organizationCheck}
              onChange={handleInputChecked}
            />
          </Form.Group>

          <Form.Group>
            <Form.Control as="select" id="organization-select" value={organizationName} onChange={handleInputChange} disabled={!organizationCheck} >
              <option>select an organization...</option>
              <option>Meltwater Entreprenuerial Training School</option>
              <option>Presby International School</option>
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Control
              type="text"
              id="organization-position"
              placeholder="What position do you occupy in your organization"
              value={organizationPosition}
              onChange={handleInputChange}
              disabled={!(organizationCheck && (organizationName !== "select an organization..."))}
            />
          </Form.Group>

          <hr />

          <Form.Group>
            <Form.Check
              type="checkbox"
              label="I agree to the terms"
              id="terms-and-condition"
              checked={tosAgreement}
              onChange={handleInputChecked}
            />
          </Form.Group>

          <Button className="mt-4" onClick={handleSignup} block>
            { isRequesting &&
              "Please wait..."
            }
            { !isRequesting &&
              "Sign Up"
            }
          </Button>
        </Form>
        <p className="d-block mt-5 mb-5 pb-5 text-center">Already have an account? <Link className="font-italic" to="/login">Signin here</Link></p>
      </div>
    </div>
  );
}
