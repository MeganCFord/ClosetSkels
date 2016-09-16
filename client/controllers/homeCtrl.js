app.controller("Home", [
  "AuthFactory", 
  "apiUrl", 
  "$http", 
  "$location",
  function(AuthFactory, apiUrl, $http, $location) {

    const home = this;
    
    home.title="this is the home page. Welcome ";
    home.username = AuthFactory.currentUser();

    if (home.username === "") {
      $location.path("/");
    }

    home.logout = () => {
      AuthFactory.credentials({});
      $location.path("/");
    };

  }]);
