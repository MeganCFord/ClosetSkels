app.controller("Login", [
  "$location", 
  "$http",  
  "UserFactory", 
  "apiUrl", 
  "$cookies",
  function( $location, $http, UserFactory, apiUrl, $cookies) {

    const login = this;
    
    // Boolean to show login or register partials.
    login.registering=false;

    login.user = {
      username: "",
      password: ""
    };



    login.login = function() {
      $http({
        url: `${apiUrl}/login`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          "username": login.user.username,
          "password": login.user.password
        }
      }).then(res => {
        if (res.data.success) {
          //Encode credentials
          const encoded = window.btoa(`${login.user.username}:${login.user.password}`);
          
          // Set encoded cookie and authorization headers for http requests etc.
          $cookies.put("HalloweenCredentials", encoded);
          $http.defaults.headers.common.Authorization = "Basic " + encoded;
          UserFactory.setEncodedCredentials(encoded);
          
          // Redirect
          $location.path("/home");
        } 
      }, console.error);
    };


    login.register = function() {
      $http.post( `${apiUrl}/register`, {
        "username": login.user.username,
        "password": login.user.password}
      
      ).then(res => {
        if (res.data.success) {
          login.login();
        }
      }, () => (console.error));
    };

  }]);
