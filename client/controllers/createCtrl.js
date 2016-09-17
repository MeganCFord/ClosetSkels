app.controller("Create",[
  "$scope",
  function($scope) {
    const create = this;
    create.title="create page";
    
    $scope.$on("username", function(event, data) {
      create.username = data;
    });


  }]);
