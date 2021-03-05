/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ModalExample = (props) => {
    const {
        buttonLabel,
        className
    } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const remove = () => {
        toggle();
        props.deleteFile(props.name);
    }
    return (

        <div>
            {props.name}, {props.size} entries  <Button color="danger" onClick={toggle}>x</Button>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}>Delete {props.name}</ModalHeader>
                <ModalBody>
                    Deleting {props.name} will delete all uploaded datasets and schema from your account.  If these sets are private, you will be credited one private token for their deletion.
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={remove}>Really delete file</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ModalExample;
