app.factory( "UserFactory", [
  "APIFactory",
  "$http",
  function(APIFactory, $http) {
  
    let userObject= {}; 
    let encodedCredentials = "";

    return {

      setEncodedCredentials:(creds) => {
        // Receives encoded credentials from cookie in app.run or from login function.
        encodedCredentials = creds;
      },

      setUser: () => {
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
      }, 

      getUser: () => {
        return userObject;
      }

    };
  }]);
