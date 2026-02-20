import React from 'react'
import { Container } from 'react-bootstrap';
import { Modal, ModalHeader, ModalFooter } from 'react-bootstrap';

const Base64Converter = () => {
  return (
    <div className="Container">
      <div className="base64-converter d-flex align-items-center gap-2">
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#base64Modal">
          Base64 Converter
        </button>
      </div>

      <Modal id="base64Modal" tabIndex="-1" aria-labelledby="base64ModalLabel" aria-hidden="true">
        <ModalHeader id="base64ModalLabel">Base64 Converter</ModalHeader>
        <div className="modal-body">
          <p>Base64 Converter functionality goes here.</p>
        </div>
        <ModalFooter>
          <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default Base64Converter