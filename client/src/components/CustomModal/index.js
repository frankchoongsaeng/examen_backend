import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';

export default function CustomModal({ isLink, to, title, continueBtnText, continueBtnVariant, children, launcherText, onContinue, isbuttondisabled, ...props }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const oncontinue = () => onContinue();

  return (
    <>

      <Button {...props} onClick={handleShow}>
        {launcherText}
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title> {title} </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {children}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            close
          </Button>
          {isLink &&
            <Link to={to}>
              <Button disabled={isbuttondisabled} variant="primary">{continueBtnText || "continue"}</Button>
            </Link>
          }
          {!isLink &&
            <Button disabled={isbuttondisabled} onClick={oncontinue} variant="primary">{continueBtnText || "continue"}</Button>
          }
        </Modal.Footer>
      </Modal>
      
    </>
  );
}