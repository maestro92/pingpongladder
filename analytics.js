// to read and write data, you need to create a reference to the Firebase reference
// do this by passing the URL of your Firebase app into the Firebase constructor. 

// i am assuming Firebase app means the Firebase project you set up
var messagesRef = new Firebase('https://airpair-analytics-tutorial.firebaseio.com/');
var userId = 0;


// For user authentication
function authHandler(error, authData) {
  if (error) {
    console.log('Login Failed!', error);
  } else {
    // Set the gravatar
    document.getElementById('gravatar').src = authData.password.profileImageURL;
  }
}


// Log the user in with an email combination
messagesRef.authWithPassword({
  email    : 'hello@deanhume.com',
  password : 'dean123'
}, authHandler);


// onAuth is called when the use ris authenticated, kind of like OnCompletedBuilding function
messagesRef.onAuth(function(authData) {
   userId = authData.uid;
});



// i am saving the value of the messageInput textbox in the database. You may notice that the data is being pushed as a JSON object
// due to the nature of NoSQL databases, you can store large amounts of unstructured data. 
// there are no tables or records
var messageField = document.getElementById('messageInput');
var messageResults = document.getElementById('results');

// Save data to firebase

// the "messagesRef.child('users').child(userId)" is equivalent of "https://airpair-analytics-tutorial.firebaseio.com/users/<uid>""

// this is using the child method. Example:
// 		messageRef == https://airpair-analytics-tutorial.firebaseio.com
// 		messageRef.child('users') ==https://airpair-analytics-tutorial.firebaseio.com/users

function savedata(){
  var message = messageField.value;

  messagesRef.child('users').child(userId).push(
  {
  fieldName:'messageField', 
  text:message
  });
  messageField.value = '';
}

// Update results when data is added
messagesRef.child('users').child(userId).limitToLast(10).on('child_added', function (snapshot) {
    var data = snapshot.val();
  var message = data.text;

    if (message != undefined)
    {
      messageResults.value += '\n' + message;
    }
});

