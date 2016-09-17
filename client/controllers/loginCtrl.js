app.controller("Login", [
  "$location", 
  "$http",  
  "AuthFactory", 
  "apiUrl", 
  "$cookies",
  function( $location, $http, AuthFactory, apiUrl, $cookies) {

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
      }).success(res => {
        if (res.success) {
          /*
          Login was successful, store credentials for use in requests
          to API that require permissions
           */
          AuthFactory.encodeCredentials({
            username: login.user.username,
            password: login.user.password
          });
          // create cookie and authorization headers for http requests etc.
          $cookies.put("HalloweenCredentials", AuthFactory.getEncodedCredentials());
          $http.defaults.headers.common.Authorization = "Basic " + AuthFactory.getEncodedCredentials();
          // Redirect
          $location.path("/home");
        }
      }).error(console.error);
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
