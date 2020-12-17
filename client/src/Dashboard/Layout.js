import React from 'react';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import AppHeader from '../components/AppNav';
import Submissions from './Submissions';
import Profile from './Profile';
import Drafts from './Drafts';
import Published from './Published';

export default function Home( { children } ) {
  return(
    <>
      <AppHeader />
      <Container className="py-md-5">
        <Tabs defaultActiveKey="created_exams" id="uncontrolled-tab-example">
          <Tab eventKey="submissions" title="Submissions">
            <Submissions />
          </Tab>
          <Tab eventKey="created_exams" title="Created Exams">
            <Drafts />
          </Tab>
          <Tab eventKey="published-exams" title="Published Exams">
            <Published />
          </Tab>
          <Tab eventKey="profile" title="Profile" >
            <Profile />
          </Tab>
        </Tabs>
      </Container>
    </>
  );
}