app.controller("Nav", [
  "AuthFactory", 
  "$cookies",
  "$scope",
  "$location",
  function(AuthFactory, $cookies, $scope, $location) {

    const nav = this;
    
    nav.username = AuthFactory.getDecodedCredentials();
    if (nav.username.length === 0 || nav.username === undefined) {
      $location.path("/");
    } else {
      $scope.$emit("username", nav.username);
    }

    nav.currentPage = $location.path();

    nav.logout = () => {
      $cookies.remove("HalloweenCredentials");
      $location.path("/login");
    };

  }]);
