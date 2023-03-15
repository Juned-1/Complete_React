/*import styled from 'styled-components';

const Button = styled.button`
  width: 100%; //default width
  font: inherit;
  padding: 0.5rem 1.5rem;
  border: 1px solid #8b005d;
  color: white;
  background: #8b005d;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.26);
  cursor: pointer;
  @media(min-width: 768px){
    width: auto; //for big devices
  }
&:focus {
  outline: none;
}

&:hover,
&:active {
  background: #ac0e77;
  border-color: #ac0e77;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.26);
}
`; */
/*button is method of styled component which generate button and give unique class name than other
component. Now we do not need explicitly mention class name. and other selector from that class
can be given using &.*/
import React from 'react';
import styles from './Button.module.css'; //this new way of imprting style from css files using css module

const Button = props => {
  return (
    <button type={props.type} className={styles.button} onClick={props.onClick}>
      {props.children}
    </button>
  );
};
/*To use css as css module we need to name our css file using Butoon.module.css 
It is signal to react to work as css module
now styles become an object what we imported. Now we can bring any property from that object using dot
CSS module name css as with component name class name and with a unique hash key*/


export default Button;
