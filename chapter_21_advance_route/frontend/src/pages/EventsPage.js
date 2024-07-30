import { Suspense } from "react";
import { useLoaderData, json, defer, Await } from "react-router-dom";

import EventsList from "../components/EventsList";

function EventsPage() {
  //const data = useLoaderData();
  // if(data.isError){
  //   return <p>{data.message}</p>;
  // }
  //const events = data.events;
  const { events } = useLoaderData();
  return (
    <Suspense fallback={<p style={{textAlign : 'center'}}>Loading...</p>}>
      <Await resolve={events}>
        {(loadedEvents) => <EventsList events={loadedEvents} />}
      </Await>
    </Suspense>
  );
}

export default EventsPage;
async function loadEvents() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    //return { isError: true, message: "Could not fetch data..." };
    //throw new Response(JSON.stringify({message : 'Could not fetch events!'}), { status : 500});
    throw json({ message: "Could not fetch events!" }, { status: 500 });
  } else {
    const resData = await response.json();
    //setFetchedEvents(resData.events);
    return resData.events;
    //const res = new Response(resData, {status : 201});
    //return res;
    //return response;
  }
}
export function loader() {
  return defer({
    events: loadEvents(), //store value returned by load events
  });
}
