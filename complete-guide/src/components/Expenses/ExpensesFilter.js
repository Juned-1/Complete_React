import "./ExpensesFilter.css";

const ExpensesFilter = (props) => {
    const selectHandler = (event) =>{
        props.onSelectFilter(event.target.value);
    };
  return (
    <div className="expenses-filter">
      <div className="expenses-filte__control">
        <label>Filter by Year</label>
        <select onChange = {selectHandler} value = {props.filteredYear}>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
        </select>
      </div>
    </div>
  );
};

export default ExpensesFilter;
