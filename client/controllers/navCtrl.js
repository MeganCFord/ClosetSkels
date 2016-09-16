app.controller("Nav", [
  "AuthFactory", 
  "$http", 
  "$location",
  function(AuthFactory, $http, $location) {

    const nav = this;
    
    nav.username = AuthFactory.currentUser();

    if (nav.username === "") {
      $location.path("/");
    }

    nav.logout = () => {
      AuthFactory.credentials({});
      $location.path("/");
    };

  }]);
