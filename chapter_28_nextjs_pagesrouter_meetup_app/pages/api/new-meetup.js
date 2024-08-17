// /api/new-meetup
import { MongoClient } from "mongodb";
const connectionString = "connection_string";

export default async function handler(req, res) {
  if (req.method === "POST") {
    //this ensure only post request trigger in this route
    const data = req.body;

    //connecting
    const client = await MongoClient.connect(connectionString);
    const db = client.db(); //get hold of database
    const meetupsCollection = db.collection("meetups"); //collection will be created if does not exist, we can give any name to collection

    const result = await meetupsCollection.insertOne(data);
    console.log(result);

    //close database connection
    client.close();

    res.status(201).json({ message: "Meetup inserted successlly!" });
  }
}
