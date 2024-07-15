import classes from "./Counter.module.css";
import { useSelector, useDispatch} from "react-redux";
import { counterActions } from "../store/counter";
const Counter = () => {
  const dispatch = useDispatch();
  const counter = useSelector((state) => state.counter.counter); //takes store when ever state update and action is called and return value of store
  const show = useSelector(state => state.counter.showCounter);
  const toggleCounterHandler = () => {
    //dispatch({ type : 'toggle' });
    dispatch(counterActions.toggleCounter());
  };
  const incrementHandler = () => {
    //dispatch({type : 'increment' });
    dispatch(counterActions.increment());
  }
  const decrementHandler = () => {
    //dispatch({ type : 'decrement' });
    dispatch(counterActions.decrement());
  }
  const increaseHandler = () => {
    //dispatch({type : 'increase', amount : 5 }); //providing payload to action
    dispatch(counterActions.increase(5)); //{type : 'some-unique-string', paylaod : value}
  }
  return (
    <main className={classes.counter}>
      <h1>Redux Counter</h1>
      {show && <div className={classes.value}>{counter}</div>}
      <div>
        <button onClick={incrementHandler}>Increment</button>
        <button onClick={increaseHandler}>Increment By 5</button>
        <button onClick={decrementHandler}>Decrement</button>
      </div>
      <button onClick={toggleCounterHandler}>Toggle Counter</button>
    </main>
  );
};
export default Counter;
// class Counter extends Component {
//   incrementHandler(){
//     this.props.increment();
//   }
//   decrementHandler(){
//     this.props.decrement();
//   }
//   toggleCounterHandler(){

//   }
//   render() {
//     return (
//       <main className={classes.counter}>
//         <h1>Redux Counter</h1>
//         <div className={classes.value}>{this.props.counter}</div>
//         <div>
//           <button onClick={this.incrementHandler.bind(this)}>Increment</button>
//           <button onClick={this.decrementHandler.bind(this)}>Decrement</button>
//         </div>
//         <button onClick={this.toggleCounterHandler}>Toggle Counter</button>
//       </main>
//     );
//   }
// }
// const mapStateToProps = state => {
//   return {
//     counter : state.counter,
//   }
// }
// const mapDispatchProps = dispatch => {
//   return {
//     increment : () => dispatch({ type : 'increment' }),
//     decrement : () => dispatch({ type : 'decrement' })
//   }
// }
// export default connect(mapStateToProps, mapDispatchProps)(Counter); //connect return another method when executed and that method takes Counter component as argument when it is executed.
