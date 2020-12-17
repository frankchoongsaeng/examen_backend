import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavRouter from '../../routers/navRouter';
import logo from './examen.png';

export default function AppHeader() {

  return(
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">
        <img
          alt=""
          src={logo}
          width="150"
          height="40"
          className="d-inline-block align-top"
        />{' '}
        
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <NavRouter />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )  
}