import {
  json,
  redirect,
  useRouteLoaderData,
  defer,
  Await,
} from "react-router-dom";
import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";
import { Suspense } from "react";
export default function EventDetailsPage() {
  //const params = useParams();
  //const data = useRouteLoaderData("event-details");
  const { event, events } = useRouteLoaderData("event-details");
  return (
    <>
      <Suspense fallback={<p style={{textAlign : 'center'}}>Loading...</p>}>
        <Await resolve={event}>
          {(loadedEvent) => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>
      <Suspense fallback={<p style={{textAlign : 'center'}}>Loading...</p>}>
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
}
async function loadEvent(id) {
  const response = await fetch("http://localhost:8080/events/" + id);
  if (!response.ok) {
    return json(
      { message: "Could not fetch details for selected events!" },
      {
        status: 500,
      }
    );
  }
  const resData = await response.json();
  return resData.event;
}
async function loadEvents() {
  const response = await fetch("http://localhost:8080/events");
  if (!response.ok) {
    throw json({ message: "Could not fetch events!" }, { status: 500 });
  } else {
    const resData = await response.json();
    return resData.events;
  }
}
export async function loader({ request, params }) {
  const id = params.eventId;

  return defer({
    event: await loadEvent(id),
    events: loadEvents(),
  });
}

export async function action({ params, request }) {
  const eventId = params.eventId;
  const response = await fetch("http://localhost:8080/events/" + eventId, {
    method: request.method,
  });
  if (!response.ok) {
    return json(
      { message: "Could not delete event!" },
      {
        status: 500,
      }
    );
  }
  return redirect("/events");
}
