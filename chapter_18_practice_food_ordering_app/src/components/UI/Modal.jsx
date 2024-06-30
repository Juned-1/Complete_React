import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
export default function Modal({ children, open, onClose, className = ''}) {
  const dialog = useRef();
  //one way to handle open with background is forward ref
  //second way is using useEffect which interact with dialog code
  useEffect(() => {
    const modal = dialog.current; //we need to store modal element in some constant, since clean up function will run in future at an other time, but value stored ref could change theoratically. therefore it is recommended to store somewhere, so when useEffect is run same clean element get clean
    if (open) {
        modal.showModal();
    }

    return () => modal.close(); 
  }, [open]);
  return createPortal(
    <dialog ref={dialog} className={`modal ${className}`} onClose={onClose}>{children}</dialog>,
    document.getElementById("modal")
  );
}
