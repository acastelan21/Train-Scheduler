// Initialize Firebase
var config = {
    apiKey: "AIzaSyBPgbe79bt6FJCxIVOs0V5N1p0vywhLKzM",
    authDomain: "trainschedule-25555.firebaseapp.com",
    databaseURL: "https://trainschedule-25555.firebaseio.com",
    projectId: "trainschedule-25555",
    storageBucket: "trainschedule-25555.appspot.com",
    messagingSenderId: "1045927630369"
  };
  firebase.initializeApp(config);

  var database = firebase.database ()

  var trainName = "";
  var destinationName ="";
  var frequency = "";
 
  var minutesAway = ""; 



  var connectionsRef = database.ref("/connections");

  var connectedRef = database.ref(".info/connected");
  
  // When the client's connection state changes...
  connectedRef.on("value", function (snap) {
  
      // If they are connected..
      if (snap.val()) {
  
          // Add user to the connections list.
          var con = connectionsRef.push(true);
          // Remove user from the connection list when they disconnect.
          con.onDisconnect().remove();
      }
  });
  connectionsRef.on("value", function (snap) {

});


  $(".btn").on("click", function (event) {
    event.preventDefault();

    // Text input variables
    var trainName = $("#train-name").val().trim();
    var destinationName = $("#train-destination").val().trim();
    var firstTrainTime= $("#first-train-time").val().trim();
    var frequency = $("#train-frequency").val().trim();
    database.ref("/trainData").push({
        trainName: trainName,
        destinationName: destinationName,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

$(".btn").on("click", function (event) {
    $("#train-form")[0].reset();
});
database.ref("/trainData").on("value", function (snapshot) {
    // ------------------------------------
    $("#train-info").empty();
    snapshot.forEach(function (childSnapshot) {
        //check for valid child
        if (!childSnapshot.child("trainName").exists()) {
            return;
        }
        var trainName = childSnapshot.val().trainName;
        var destinationName = childSnapshot.val().destinationName;
        var firstTrainTime = childSnapshot.val().firstTrainTime;
        var frequency = childSnapshot.val().frequency;
       
        // Moments stuff goes here
        var currentTime = moment ();
        var firstTrainTimeConverted = moment(firstTrainTime,"HH:mm").subtract(1,"years");

        var diffTime = moment().diff(moment(firstTrainTimeConverted),"minutes")

        var tRemainder = diffTime % frequency
        var tMinutesTillTrain = frequency -tRemainder;

        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");
        //
        // Show form stuff
        var newRow = $("<tr>");
        var trainNameDisplay = $("<td>").text(trainName);
        var destinationNameDisplay = $("<td>").text(destinationName);
        var frequencyDisplay = $("<td>").text(frequency);
        var nextArrivalDisplay = $("<td>").text(nextTrain);
        var minutesAwayDisplay = $("<td>").text(tMinutesTillTrain);        
        
        newRow.append(trainNameDisplay, destinationNameDisplay,frequencyDisplay, nextArrivalDisplay, minutesAwayDisplay);
        $("#train-info").append(newRow);
    });
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});