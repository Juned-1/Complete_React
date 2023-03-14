import ExpenseDate from './ExpenseDate';
import './ExpenseItem.css';
import Card from '../UI/Card';
function ExpenseItem(props){
    //stateless component 
    console.log('Expense Item is evaluated');
    
    return(
        <Card className="expense-item">
            <ExpenseDate date = {props.date} />
            <div className="expense-item__description">
                <h2>{props.title}</h2>
                <div className="expense-item__price">${props.amount}</div>
            </div>
        </Card>
    );
}
//JSX function returns exactly one root element, rest of elements can be wrapped inside it
//In JSX inside {} we run jaavascript code
//In simple JS we add event listener to an element imperatively, but here in react we use props
//like onClick, onAbort etc.
//useState hook return a state and method to update state
//when a state is updated react tells the registered component where the state is regiisterd
//to schedule re-render the JSX of this components. Since setState directly do not update
//rather schedule re render of component's JSX, therefore console.log after it gives yet
//older value of state
//React hook is imported by named hook and react hook is called inside component function only
//neither in nested function nor outside component function.
//useState register function components instances separely for different number of times components
//is used each it will register state with different instances of components
//array destructring to hold the value and method refrence returned by hook
export default ExpenseItem;