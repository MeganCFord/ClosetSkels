app.controller("Nav", [
  "AuthFactory", 
  "$location",
  "$cookies",
  "$scope",
  function(AuthFactory, $location, $cookies, $scope) {

    const nav = this;
    
    nav.username = AuthFactory.getDecodedCredentials();
    if (nav.username.length === 0 || nav.username === undefined) {
      $location.path("/");
    } else {
      $scope.$emit("username", nav.username);
    }

    nav.logout = () => {
      $cookies.remove("HalloweenCredentials");
      $location.path("/login");
    };

  }]);
