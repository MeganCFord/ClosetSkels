app.factory( "AuthFactory", function($http) {
  
  let userCredentials={};
  // For Scopes.
  let username="";

  return {
    credentials: (creds) => {
      if(creds) {
        userCredentials=creds;
        username=userCredentials.username;
      } else {
        if (userCredentials.hasOwnProperty("password")) {
          return window.btoa(`${userCredentials.username}:${userCredentials.password}`);
        } else {
          return false;
        }
      }
    },
    currentUser: () => {
      return username;
    }
  };
});
