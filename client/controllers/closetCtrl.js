app.controller("Closet",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$http",
  "$uibModal",
  function($scope, APIFactory, $timeout, $http, $uibModal) {
    const closet = this;

    closet.userInfo = {};
    closet.costumes = [];
    closet.search="";
    
    $scope.$on("username", function(event, data) {
      // wrapped in a timeout to ensure the scope emitter gets here before we try to use its data.
      $timeout().then(() => {
        closet.username = data;
      }).then(() => {
        return APIFactory.getUserInfo(closet.username)
      .then((data) => {
        closet.userInfo = data;
        $timeout();
      }, e=>console.error)
      .then(() => {
        // only get the costumes for the current user.
        return APIFactory.getUserCostumes(closet.username);
      }).then((res) => {
        closet.costumes = res;
        $timeout();
        console.log("user costumes", closet.costumes);
      }, (e) => console.error);
      });
    });

    closet.deleteCostume = (costumeurl) => {
      return APIFactory.deleteSomething(costumeurl)
      .then(()=> {
        for(const u in closet.costumes) {
          if (closet.costumes[u].url === costumeurl) {
            closet.costumes.splice(u, 1);
          }
        }
        $timeout();
      }, e => console.error);
    };

    closet.openModal = (costume) => {
      console.log("costume I'm sending", costume);
    //Sending the entire object into modal.
      const modalInstance = $uibModal.open({
        size: "lg",
        templateUrl: "/partials/detail.html", 
        controller: "Detail",
        controllerAs: "detail", 
        resolve: {
          "costume": costume, 
          "userInfo": closet.userInfo
        }
      });
    };

  }]);
