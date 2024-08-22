import { Link, Form, redirect } from "react-router-dom";
import classes from "./NewPost.module.css";
import Modal from "../components/Modal";

function NewPost() {
  return (
    <Modal>
      <Form method='POST' className={classes.form}>
        <p>
          <label htmlFor="body">Text</label>
          <textarea id="body" required rows={3} name="body" />
        </p>
        <p>
          <label htmlFor="name">Your name</label>
          <input
            type="text"
            id="name"
            name="author"
            required
          />
        </p>
        <p className={classes.actions}>
          <Link to="..">
            Cancel
          </Link>
          <button>Submit</button>
        </p>
      </Form>
    </Modal>
  );
}

export default NewPost;

export async function action({ request }){
  //passes data object by Form which holds data.request
  const formData = await request.formData();
  const postData = Object.fromEntries(formData); //{body : ..., author : ...}

  await fetch("http://localhost:8080/posts", {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return redirect('/'); //redirect generate a response object, if it is redirect resposne react router move to route which we are calling
}