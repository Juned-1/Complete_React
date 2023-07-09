import React from 'react';
import Card from './Card';
import Button from './Button';
import classes from './ErrorModal.module.css';
import { Fragment } from 'react';
import ReactDom from 'react-dom';
const Backdrop = (props) => {
    return <div className={classes.backdrop} onClick = {props.onConfirm}></div>
};
const ModalOverlay = (props) => {
    return(
        <Card className = {classes.modal}>
            <header className={classes.header}>
                <h2>{props.title}</h2>
            </header>
            <div className={classes.content}>
                <p>{props.message}</p>
            </div>
            <footer className={classes.actions}>
                <Button onClick = {props.onConfirm}>Okay</Button>
            </footer>
        </Card>
    );
};
const ErrorModal = (props) => {
    return(
        <Fragment>
            {ReactDom.createPortal(<Backdrop onConfirm = {props.onConfirm} />,document.getElementById('backdrop-root'))}
            {ReactDom.createPortal(<ModalOverlay title = {props.title} message = {props.message} onConfirm = {props.onConfirm} />,document.getElementById('modal-root'))}
        </Fragment>
    );
};
export default ErrorModal;
/*Modal,sidebar etc are overlay on html page. They are not part of page yet they
displayed on page over other html content. But it generally may not always work
They can renederd in more efficient using portal to to render so that they may not
create collision with other html content. Portal have two thing a place to port and tell it
where it needs to be ported
go to index.html and add two div backdrop-root div and modal-root div where the modal will
be ported when backdropped and opened */

/*React keeps all feature of react and react dom helps to bring those feature
in browser dom. React library do not care whether we render in web or 
built in with native application. */

