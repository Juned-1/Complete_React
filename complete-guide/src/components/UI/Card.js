//composition -creating wrapper components for more composition like custom components
import './Card.css';
function Card(props){
    const classes = 'card '+props.className;

    return <div className = {classes}>{props.children}</div>;
}

/*Using custom components as wrapper class directly do not work custom html wrapper tag like div span
To use it as wrapper class we need to take props, but this props do not need to be passed
since it is by default passed by react as children to display all children components inside 
wrapper class. children is reseverd. value of children si compoents between opening and closing wrapper
component.
We have imported some style but other styles are attached with children components, to bring them
along with card conatiner. To ensure a class name has been set and have an impact we need add
those class names card is default class which is always applies and children component classes*/
export default Card;