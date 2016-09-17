app.controller("Home",[
  "$scope",
  function($scope) {
    const home = this;
    home.title="hey home page";
    home.username = "";
    
    $scope.$on("username", function(event, data) {
      home.username = data;
    });


  }]);
