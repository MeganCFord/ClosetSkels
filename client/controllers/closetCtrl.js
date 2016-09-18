app.controller("Closet",[
  "$scope",
  "APIFactory",
  "$timeout",
  function($scope, APIFactory, $timeout) {
    const closet = this;
    closet.title="closet page";
    // closet.costumes = [];
    
    $scope.$on("username", function(event, data) {
      // wrapped in a timeout to ensure the scope emitter gets here before we try to use its data.
      $timeout().then(() => {closet.username = data; return data;})
      .then((data) => {
        // API will only return the costumes for the current user.
        APIFactory.getUserCostumes(data)
        .then((res) => {
          closet.costumes = res;
          $timeout();
          console.log("user costumes", closet.costumes);
        }, (e) => console.log(e));
      });
    });

  }]);
