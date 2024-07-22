import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import RootLayout from "./pages/Root";
import ErrorPage from "./pages/Error";
import ProductDetailsPage from "./pages/ProductDetails";
const route = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index : true, element: <Home /> }, //relative path in child route. path : ''
      { path: "products", element: <Product /> },
      { path: "products/:productId", element: <ProductDetailsPage /> },
    ],
  },
]);
// const routeDefinition = createRoutesFromElements(
//   //with one wrapper route we can create nested route
//   <Route>
//     <Route path="/" element={<Home />} />
//     <Route path="/products" element={<Product />} />
//   </Route>
// );
// const route = createBrowserRouter(routeDefinition);
function App() {
  return <RouterProvider router={route} />;
}

export default App;
