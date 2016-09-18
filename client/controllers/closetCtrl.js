app.controller("Closet",[
  "$scope",
  "APIFactory",
  "$timeout",
  function($scope, APIFactory, $timeout) {
    const closet = this;
    closet.title="closet page";
    // closet.username = "";
    
    $scope.$on("username", function(event, data) {
      $timeout().then(() => {closet.username = data; return data;})
      .then((data) => {
        console.log(data, "this should be the username I'm passing to get costumes.");
    // load costumes to repeat through.
        APIFactory.getUserCostumes(data)
        .then((res) => {
          closet.costumes = res;
          $timeout();
          console.log("user costumes", closet.costumes);
        }, (e) => console.log(e));
      });
    });

  }]);
