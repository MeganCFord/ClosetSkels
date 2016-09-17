app.controller("Likes",[
  "$scope",
  function($scope) {
    const likes = this;
    likes.title="likes page";
    
    $scope.$on("username", function(event, data) {
      likes.username = data;
    });


  }]);
