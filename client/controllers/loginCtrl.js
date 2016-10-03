app.controller("Login", [
  "$location", 
  "$http",  
  "UserFactory", 
  "apiUrl", 
  "$cookies",
  function( $location, $http, UserFactory, apiUrl, $cookies) {

    const login = this;

    login.user = {
      username: "",
      password: "", 
      first_name: "",
      last_name: ""
    };

    // Boolean to show login or register partials.
    login.registering=false;


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
          const encoded = UserFactory.encodeCredentials({
            username: login.user.username,
            password: login.user.password
          });
          // create encoded cookie and authorization headers for http requests etc.
          $cookies.put("HalloweenCredentials", encoded);
          $http.defaults.headers.common.Authorization = "Basic " + encoded;
          // Redirect
          $location.path("/home");
        } 
      }, console.error);
    };


    login.register = function() {
      $http.post( `${apiUrl}/register`, {
        "username": login.user.username,
        "password": login.user.password,
        "first_name": login.user.first_name,
        "last_name": login.user.last_name}
      ).then(res => {
        if (res.success) {
          login.login();
        }
      }, () => (console.error));
    };

  }]);
