import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Posts, {loader as postLoader} from "./route/Posts.jsx";
import "./index.css";
import NewPost, { action as newPostAction } from "./route/NewPost.jsx";
import RootLayout from "./route/RootLayout.jsx";
import PostDetails, {loader as postDetailsLoader } from "./route/PostDetails.jsx";
const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Posts />,
        loader : postLoader,
        children: [
          {
            path: "/create-post",
            action : newPostAction,
            element: <NewPost />,
          },
          {
            path: '/:id',
            element: <PostDetails />,
            loader : postDetailsLoader
          }
        ],
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
);
