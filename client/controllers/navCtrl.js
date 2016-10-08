app.controller("Nav", [
  "UserFactory", 
  "$cookies",
  "$scope",
  "$timeout",
  "$location",
  function(UserFactory, $cookies, $scope, $timeout, $location) {

    const nav = this;
    nav.user = {};
    
    UserFactory.getUser().then((res) => {
      nav.user = res;
      $timeout();
      // Emit user to other controllers.
      $scope.$emit("user", nav.user);
    });

    nav.currentPage = $location.path();

    nav.logout = () => {
      $cookies.remove("HalloweenCredentials");
      $location.path("/login");
    };

  }]);
