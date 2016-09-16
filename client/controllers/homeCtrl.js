app.controller("Home", [
  "AuthFactory", 
  "apiUrl", 
  "$http", 
  function(AuthFactory, apiUrl, $http) {

    const home = this;

    home.title="hey home page";


  }]);
