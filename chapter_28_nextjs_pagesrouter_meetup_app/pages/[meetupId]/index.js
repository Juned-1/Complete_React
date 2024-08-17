import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
import MeetupDetail from "../../components/meetups/MeetupDetail";
export default function MeetupDetailsPage(props) {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        title={props.meetupData.title}
        image={props.meetupData.image}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
}
export async function getStaticPaths() {
  const connectionString = "connection_string";

  const client = await MongoClient.connect(connectionString);
  const db = client.db(); //get hold of database
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray(); // {} empty filter object select all meetup, {_id : 1} select id of all document
  client.close();
  return {
    fallback: "blocking", //given path during deployment are not all, other path can be there try to resolve
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}
export async function getStaticProps(context) {
  //fetch the data for a meetup
  const meetupId = context.params.meetupId;
  const connectionString = "connection_string";


  const client = await MongoClient.connect(connectionString);
  const db = client.db(); //get hold of database
  const meetupsCollection = db.collection("meetups");
  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });
  client.close();
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        image: selectedMeetup.image,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
      },
    },
  };
}
