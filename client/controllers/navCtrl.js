app.controller("Nav", [
  "AuthFactory", 
  "$http", 
  "$location",
  "$cookies",
  function(AuthFactory, $http, $location, $cookies) {

    const nav = this;
    
    nav.username = AuthFactory.getDecodedCredentials();
    if (nav.username.length === 0 || nav.username === undefined) {
      $location.path("/");
    }

    nav.logout = () => {
      $cookies.remove("HalloweenCredentials");
      $location.path("/login");
    };

  }]);
