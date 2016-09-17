app.controller("Home",[
  "$scope",
  function($scope) {
    const home = this;
    home.title="home page";
    
    $scope.$on("username", function(event, data) {
      home.username = data;
    });


  }]);
