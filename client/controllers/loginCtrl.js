app.controller("Login", [
  "$location", 
  "$http",  
  "AuthFactory", 
  "apiUrl", 
  function( $location, $http, AuthFactory, apiUrl) {

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
      $http.post(`${apiUrl}/login`, {"username": login.user.username,"password": login.user.password}
      ).success(res => {
        if (res.success) {
          /*
          Login was successful, store credentials for use in requests
          to API that require permissions
           */
          AuthFactory.credentials({
            username: login.user.username,
            password: login.user.password
          });

          // Redirect to home page on successful login
          $location.path("/main");
        }
      }).error(console.error);
    };


    login.register = function() {
      $http.POST( `${apiUrl}/register`, {
        "username": login.user.username,
        "password": login.user.password,
        "first_name": login.user.first_name,
        "last_name": login.user.last_name}
      ).success(res => {
        if (res.success) {
          login.login();
        }
      }).error(console.error);
    };

  }]);
