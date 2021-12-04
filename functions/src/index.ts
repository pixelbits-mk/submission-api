

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// import libraries
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";

// initialize firebase inorder to access its services
admin.initializeApp(functions.config().firebase);

// initialize express server
const app = express();
const main = express();

// add path to receive request and set json as bodyParser to process the body
main.use("/api/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));

// initialize the database and the collection
const db = admin.firestore();
const userCollection = "users";

// define google cloud function name
export const webApi = functions.https.onRequest(main);


interface User {
    firstName: string,
    lastName: string,
    email: string,
    areaNumber: string,
    department: string,
    id:string,
    contactNumber:string
}

// Create new user
app.post("/users", async (req, res) => {
  try {
    const user: User = {
      firstName: req.body["firstName"],
      lastName: req.body["lastName"],
      email: req.body["email"],
      areaNumber: req.body["areaNumber"],
      department: req.body["department"],
      id: req.body["id"],
      contactNumber: req.body["contactNumber"],
    };

    const newDoc = await db.collection(userCollection).add(user);
    res.status(201).send(`Created a new user: ${newDoc.id}`);
  } catch (error) {
    res.status(400).send(
        // eslint-disable-next-line max-len
        "User should cointain firstName, lastName, email, areaNumber, department, id and contactNumber!!!");
  }
});

// get all users
app.get("/users", async (req, res) => {
  try {
    const userQuerySnapshot = await db.collection(userCollection).get();
    const users: { id: string, data: User }[] = [];
    userQuerySnapshot.forEach(
        (doc)=>{
          users.push({
            id: doc.id,
            data: doc.data() as User,
          });
        }
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});
