import { useRouter } from "next/router";
import NewMeetupForm from "../../components/meetups/NewMeetupForm";
import Head from "next/head";
export default function NewMeetupPage() {
  const router = useRouter();
  async function handleAddMeetup(enteredData) {
    //if external server then it is domain/path, but it is same server hence we can directly use route after /
    const response = await fetch("/api/new-meetup", {
      method: "POST",
      body: JSON.stringify(enteredData),
      headers: {
        "Content-Type": "application/json",
      },
    }); // /api/file_name
    const data = await response.json();
    console.log(data);
    //we call replace method instead of push in router if we want to not go back using back button after inserting data
    router.replace("/");
  }

  return (
    <>
      <Head>
        <title>Add a new Meetup</title>
        <meta
          name="description"
          content="Add your meetup to get the opportunity to connect with amazing network."
        />
      </Head>
      <NewMeetupForm onAddMeetup={handleAddMeetup} />;
    </>
  );
}
