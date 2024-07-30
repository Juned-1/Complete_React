import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayoutPage from "./pages/RootLayoutPage";
import HomePage from "./pages/HomePage";
import EventPage, { loader as eventLoader }from "./pages/EventsPage";
import EventDetailsPage, {loader as eventDetailsLoader, action as deleteEventAction } from "./pages/EventDetailsPage";
import NewEventPage from "./pages/NewEventPage";
import EditEventPage from "./pages/EditEventPage";
import EventsRootLayout from "./pages/EventsRoot";
import ErrorPage from "./pages/Error";
import { action as manipulateEvent } from "./components/EventForm";
import NewsletterPage, { action as newsletterAction } from "./pages/NewsletterPage";
// Challenge / Exercise
// 1. Add five new (dummy) page components (content can be simple <h1> elements)
//    - HomePage
//    - EventsPage
//    - EventDetailPage
//    - NewEventPage
//    - EditEventPage
// 2. Add routing & route definitions for these five pages
//    - / => HomePage
//    - /events => EventsPage
//    - /events/<some-id> => EventDetailPage
//    - /events/new => NewEventPage
//    - /events/<some-id>/edit => EditEventPage
// 3. Add a root layout that adds the <MainNavigation> component above all page components
// 4. Add properly working links to the MainNavigation
// 5. Ensure that the links in MainNavigation receive an "active" class when active
// 6. Output a list of dummy events to the EventsPage
//    Every list item should include a link to the respective EventDetailPage
// 7. Output the ID of the selected event on the EventDetailPage
// BONUS: Add another (nested) layout route that adds the <EventNavigation> component above all /events... page components
const route = createBrowserRouter([
  {
    path: "/",
    element: <RootLayoutPage />,
    errorElement : <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "events",
        element: <EventsRootLayout />,
        children: [
          {
            index : true,
            element: <EventPage />,
            loader : eventLoader
          },
          {
            path : ":eventId",
            loader : eventDetailsLoader, //eventDetailsLoader will run for all children
            id : 'event-details', //id is used for tracking data in an id using useRouteLoaderData
            children : [
              {
                index : true,
                element: <EventDetailsPage />,
                action : deleteEventAction
              },
              {
                path: "edit",
                element: <EditEventPage />,
                action : manipulateEvent
              },
            ]
          },
          {
            path: "new",
            element: <NewEventPage />,
            action : manipulateEvent,
          },

        ],
      },
      {
        path: 'newsletter',
        element: <NewsletterPage />,
        action: newsletterAction,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={route} />;
}

export default App;
