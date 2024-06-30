import MealItem from "./MealItem.jsx";
import useHttp from "../hook/useHttp.js";
import Error from "./Error.jsx";
const requestConfig = {};
export default function Meals() {
  //const {data : loadedMeals, isLoading, error} =  useHttp('http://localhost:3000/meals',{},[]); //here config object is every time recrate henece inside useHttp's useEffect dependency is changing eveytime and creating infinite loop
  //To resolve this we create global config object so that it do not get created on re-execution of component function
  const {data : loadedMeals, isLoading, error} =  useHttp('http://localhost:3000/meals',requestConfig,[]); //here config object is every time recrate henece inside useHttp's useEffect dependency is changing eveytime and creating infinite loop
  if(isLoading){
    return <p className="center">Fetching meals...</p>;
  }
  if(error){
    return <Error title="Failed to fetch data" message={error}/>
  }
  if(!loadedMeals){
    console.log(loadedMeals);
  }
  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal}/>
      ))}
    </ul>
  );
}
