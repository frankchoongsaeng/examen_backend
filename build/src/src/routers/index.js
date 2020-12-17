import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import AuthRoute from '../Auth';
import Dashboard from '../Dashboard';
import Create from '../Create';
import Session from '../Session';
import { verifyToken as verify } from '../util/api_service';
import switcher from '../util/switch';

export default function Routes() {

  const [isVerifyingToken, setIsVerifyingToken] = useState(true)
  const history = useHistory();
  const location = useLocation();

  const verifyToken = () => {

    if (localStorage.getItem("token")) {
      verify(localStorage.getItem("token"))
        .then(res => {
          switcher(res.status, () => {
            console.log(res.data);

            // clear storage if the user
            // token is invalid 
            if (!res.data.isvalid) {
              localStorage.clear();
            }

            if (res.response) {
              // an error has occurred otherwise,
              // the res object should not have a 
              // response object attached to it
              console.log(res);
              localStorage.clear();
            }
          });
        })
        .then(() => {
          setIsVerifyingToken(false);
        });

    }
    else {
      setIsVerifyingToken(false)
    }
  }


  useLayoutEffect(() => {

    let isSessionPage = (/\/session\/.*\/.*/).test(location.pathname);

    // do  not do the checks for each exam session page
    if (!isSessionPage) {

      let token = localStorage.getItem("token");
      let requestedRoute = history.location.pathname;

      if (!token || token === undefined) {

        // check if the route the user was going 
        // to was the login or signup route
        if (requestedRoute.match(/\/login*/g) || requestedRoute.match(/\/signup*/g)) {

          // allow the user to those pages as long they are not logged in
          // .... more to do here

        }
        else {
          // redirect the user to the login page and add 
          // the intended to-path to the redirect query param
          let redirectLink = requestedRoute ? `/login?redirect=${requestedRoute}` : "/login"
          history.push(redirectLink);
        }
      }
      else {
        // redirect to dashboard if the user is logged in 
        // and trying to access the login or signup page
        if (requestedRoute.match(/\/login*/g) || requestedRoute.match(/\/signup*/g)) {
          history.push("/dashboard")
        }
      }

    }
  }, [isVerifyingToken, history, location])


  useEffect(() => {
    setIsVerifyingToken(true);
    verifyToken();
  }, [])


  return (
    <>
      { isVerifyingToken &&
        <div style={{
          backgroundColor: "#eee",
          position: "fixed",
          zIndex: "1000",
          width: "100vw",
          height: "100vh"
        }} className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      }

      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/edit" component={Create} />
        <Route path="/session" component={Session} />
        <Route path="/" component={AuthRoute} />
      </Switch>
    </>
  )
}