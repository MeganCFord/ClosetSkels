
//   // Initialize Firebase. TODO: somehow there is a hidden one of these duplicating data and I don't know where.
// var config = {
//   apiKey: "AIzaSyBPlrwFlbxXy8_b_yWtgQ9Ufxmlu3p1I4Y",
//   authDomain: "closet-skels.firebaseapp.com",
//   databaseURL: "https://closet-skels.firebaseio.com",
//   storageBucket: "gs://closet-skels.appspot.com/",
//   messagingSenderId: "1091164121744"
// };
// firebase.initializeApp(config);

// // firebase.app().delete().then(function() {
// //   console.log("[DEFAULT] App is Gone Now");
// // });

app.factory( "FirebaseFactory", [ 
  "$http",
  "$timeout",  
  function($http, $timeout) {

    return {
      //upload image on start page.
      // TODO: change the path so it's like a random number or something (no duplicates)
      uploadImage: (file, path=file.name) => {
        return $timeout().then(() => (
        new Promise((resolve, reject) => {
          const uploadTask = firebase.storage().ref()
            .child(path).put(file);

          uploadTask.on("state_changed",
            null,
            reject,
            () => resolve(uploadTask.snapshot)
          );
        })
      ));
      }
    };

  }]);
