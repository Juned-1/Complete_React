import { MongoClient } from "mongodb";
import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";
export default function HomePage(props) {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}
// export async function getServerSideProps(context){
//     const req = context.req;
//     const res = context.res;
//     return {
//         props : {
//             meetups : DUMMY_MEETUP
//         }
//     }
// }
export async function getStaticProps() {
  //fetch meetup -- we don't need extra api for that, this code alread runs in server during build
  const connectionString = "connection_string";
  const client = await MongoClient.connect(connectionString);
  const db = client.db(); //get hold of database
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray(); //find -- finds all
  client.close();
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(), //convert object id into string which is usable in frontend
      })),
    },
    revalidate: 10,
  };
}
