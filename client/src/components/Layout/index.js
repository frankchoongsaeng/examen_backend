import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Drafts from '../../pages/Dashboard/Drafts';
import Submissions from '../../pages/Dashboard/submissions';
import Published from '../../pages/Dashboard/published';
import Profile from '../../pages/Dashboard/profile';

export default function Layout( ) {
  return (
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
  )
}