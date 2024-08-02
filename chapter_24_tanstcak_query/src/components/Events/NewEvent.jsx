import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { createNewEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { queryClient } from "../../util/http.js";
export default function NewEvent() {
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess : () => {
      //only execute mutate succeed
      //invalidating query to refetch event after addition of new event
      queryClient.invalidateQueries({ queryKey : ['events']}); //invalidate any query that include events
      //naviagting back to events
      navigate('/events');
    }
  });
  function handleSubmit(formData) {
    mutate({ event: formData });
    //navigate('/events'); //we naviagte no matter whether mutation succeed or not, after calling mutate
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="An error occured!"
          message={
            error.info?.message ||
            "Failed to create event. Please check your input of even and try again"
          }
        />
      )}
    </Modal>
  );
}
