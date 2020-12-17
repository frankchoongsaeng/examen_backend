import { Route, Switch } from 'react-router-dom';
import ActiveSession from '../Session/ActiveSession';
import PreviewQuestion from '../Session/PreviewQuestion';

export default function SessionRouter( { children, ...props } ) {
  return (
    <Switch>
      <Route path="/preview-question" component={PreviewQuestion} />
      <Route path="/session/:hexstamp/:title" component={ActiveSession} />
    </Switch>
  );
} 
