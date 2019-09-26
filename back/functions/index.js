// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

const  project_info = {
  "project_number": "836343510085",
  "firebase_url": "https://proionic-007.firebaseio.com",
  "project_id": "proionic-007",
  "storage_bucket": "proionic-007.appspot.com"
};

admin.initializeApp(project_info);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const snapshot = await admin.database().ref('/messages').push({original: original});
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  res.redirect(303, snapshot.ref.toString());
});

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const original = snapshot.val();
      console.log('Uppercasing', context.params.pushId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return snapshot.ref.parent.child('uppercase').set(uppercase);
});
//
exports.sendMessage = functions.https.onRequest((request, response) => {
  var topic = "people";
  var token="cb8X2pa_4II:APA91bHBGBda8P-MD7MDi7RREJ0tN-IGYsl_94wc1qNVSrTk7r04s8uEs0rfuctAYJBNBgJmh8Mlvy1PtzgYTp8_SmyELsjguU50Vb5SS_ypgGB-5S9Mbzky0fEgAfaIaoI5NkCXbAHT";
  var device=[token];
  
  const payload = {
    "notification": {
      "title" : "You have a new activity!",
      "body"  : "activity is now assign you.",
      "click_action":"FCM_PLUGIN_ACTIVITY", 
      "icon"  : ""
    },
    "data"    : {
      "page"  :  "second",
      "price" : "$26,000.50"
    }
  };

  admin.messaging().sendToDevice (device, payload)
    .then(function (reply) {
      // See the MessagingTopicResponse reference documentation for the
      // contents of response.
      console.log("Successfully send message: ");
      response.send("Hello from Firebase: " + reply);
    })
    .catch(function (error) {
      console.log("Error sending message:", error);
      response.send("Error from Firebase: " + error );
    });
});
