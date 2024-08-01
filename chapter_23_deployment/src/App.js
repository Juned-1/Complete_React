import { createBrowserRouter, RouterProvider } from "react-router-dom";

//import BlogPage, { loader as postsLoader } from './pages/Blog';
import HomePage from "./pages/Home";
//import PostPage, { loader as postLoader } from "./pages/Post";
import RootLayout from "./pages/Root";
import { lazy, Suspense } from "react";
const BlogPage = lazy(() => import("./pages/Blog")); //lazy laoding Blog Page which is default export -- this function return promise so it is not valid component, valid component return JSX
//to resolve the promise into JSX, react gives us lazy function, which is wrapped around component.
const PostPage = lazy(() => import("./pages/Post"));
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "posts",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<p>Loading...</p>}>
                <BlogPage />
              </Suspense>
            ),
            loader: () =>
              import("./pages/Blog").then((module) => module.loader()),
          }, //lazy loading loader
          {
            path: ":id",
            element: (
              <Suspense fallback={<p>Loading...</p>}>
                <PostPage />
              </Suspense>
            ),
            loader: (meta) =>
              import("./pages/Post").then((module) => module.loader(meta)),
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
