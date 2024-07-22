import { Link, useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  function navigateHandler(){
    navigate('/products');
  }
  return (
    <>
    <h1>My Home page</h1>
    <p>Go to the <Link to="products">list of product</Link></p>
    <button onClick={navigateHandler}>Navigate</button>
    </>
  )
}
