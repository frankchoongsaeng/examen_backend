import { Redirect, Route, Switch } from 'react-router-dom';
import Login from '../Auth/Login';
import Signup from '../Auth/Signup';

export default function InitialRoute( { children, ...props } ) {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Redirect to="/login" />
    </Switch>
  );
} 