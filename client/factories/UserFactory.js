app.factory( "UserFactory", [
  "APIFactory",
  "$http",
  function(APIFactory, $http) {
  
    let userObject= {}; 
    let encodedCredentials = "";

    const setUser = () => {
      // Runs from nav. Parse username from encoded credentials, 
      const decoded = window.atob(encodedCredentials).split(":");
      return APIFactory.getApiRoot().then((root) => {
        // Get corresponding user object from API.  
        return $http.get(`${root.users}?username=${decoded[0]}`);
      }, console.error)
      .then((res) => {
        // Set user object variable, and return it to nav.
        userObject = res.data[0];
        return userObject;
      }, console.error);
    }; 


    return {

      setEncodedCredentials:(creds) => {
        // Receives encoded credentials from cookie in app.run or from login function.
        encodedCredentials = creds;
      },

      getUser: () => {
        // If the user object has already been gotten via setUser, return user object.
        if(userObject.length > 0) {
          return userObject;     
        } else {
          // Otherwise, run setUser to get the current user object via decoding and http.
          return setUser();
        }
      }

    };
  }]);
