import {
  Link,
  useNavigate,
  useParams,
  redirect,
  useSubmit,
  useNavigation,
} from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { fetchEvent, queryClient, updateEvent } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
export default function EditEvent() {
  const navigate = useNavigate();
  const { state } = useNavigation();
  const params = useParams();
  const submit = useSubmit();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", params.id], //same key as event details page therefore cached data is used in edit event page
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
    staleTime : 10000, //before 10 second do not vlidate data loaded from router
  });
  // const { mutate } = useMutation({
  //   mutationFn : updateEvent,
  //   onMutate : async(data) => {
  //     const newEvent = data.event;
  //     await queryClient.cancelQueries({queryKey : ['events', params.id]});
  //     //storing data for rollback in optimistic update
  //     const previousEvent = queryClient.getQueryData(['events', params.id]);
  //     queryClient.setQueryData(['events', params.id], newEvent);
  //     return { previousEvent };
  //   },
  //   onError : (error, data, context) => {
  //     queryClient.setQueryData(['events', params.id], context.previousEvent); //rolling back data if mutation failed
  //   },
  //   onSettled : () => {
  //     queryClient.invalidateQueries(['events', params.id]);
  //   }
  // });
  function handleSubmit(formData) {
    // mutate({ id : params.id, event : formData});
    // navigate('../');
    submit(formData, { method: "PUT" });
  }

  function handleClose() {
    navigate("../");
  }
  let content;
  // if (isPending) {
  //   content = (
  //     <div className="center">
  //       <LoadingIndicator />
  //     </div>
  //   );
  // }
  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="Failed!"
          message={error.info?.message || "Failed to load data."}
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }
  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === "submitting" ? (
          <p>Submitting data...</p>
        ) : (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Update
            </button>
          </>
        )}
      </EventForm>
    );
  }
  return <Modal onClose={handleClose}>{content}</Modal>;
}

export function loader({ params }) {
  return queryClient.fetchQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });
}
export async function action({ request, params }) {
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData);
  await updateEvent({ id: params.id, event: updatedEventData });
  await queryClient.invalidateQueries(["events"]); //we will not use optimistic update here, awating because invalidate query return promise
  return redirect("../");
}
