app.controller("Search",[
  "$scope",
  function($scope) {
    const search = this;
    search.title="search page";
    
    $scope.$on("username", function(event, data) {
      search.username = data;
    });


  }]);
