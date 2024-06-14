import { useEffect, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

function Modal({ open, children, onClose }) {
  const dialog = useRef();
  //first time when component render it will try to execute dialog ref but initially it is not yet connected with JSX so it will fail -- initally connection between ref and dialog is not estabalished
  //this ref is undefined and initally calling close on undefined dialog ref fails
  //there we can use useEffect() hook which will be executed after component execution and at that time ref and element will get connected.
  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);
  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {open ? children : null}
    </dialog>,
    document.getElementById("modal")
  );
}

export default Modal;
