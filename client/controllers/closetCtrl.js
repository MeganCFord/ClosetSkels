app.controller("Closet",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$http",
  function($scope, APIFactory, $timeout, $http) {
    const closet = this;
    closet.title="closet page";
    
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
        }, (e) => console.error);
      });
    });

    closet.deleteCostume = (costumeurl) => {
      return $http.delete(costumeurl)
      .then(()=> {
        for(const u in closet.costumes) {
          if (closet.costumes[u].url === costumeurl) {
            closet.costumes.splice(u, 1);
          }
        }
        $timeout();
      }, e => console.error);
    }

  }]);
