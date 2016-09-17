app.controller("Closet",[
  "$scope",
  function($scope) {
    const closet = this;
    closet.title="closet page";
    
    $scope.$on("username", function(event, data) {
      closet.username = data;
    });


  }]);
