app.controller("Closet",[
  "$scope",
  "$timeout",
  "$http",
  "$uibModal",
  "APIFactory",
  "CostumeFactory",
  function($scope, $timeout, $http, $uibModal, APIFactory, CostumeFactory) {
    const closet = this;

    closet.search="";
    
    $scope.$on("user", function(event, data) {
      $timeout().then(() => {
        closet.user = data;
      }).then(() => {
        // only get the costumes for the current user.
        return CostumeFactory.getUserCostumes(closet.user.id);
      }).then((res) => {
        closet.costumes = res;
        $timeout();
      }, (e) => console.error);
    });

    closet.deleteCostume = (costume) => {
      // Splice out the costume from list of costumes
      closet.costumes.splice(closet.costumes.indexOf(costume), 1);
      // Also delete it out of the database.
      APIFactory.deleteSomething(costume.url);
    };

    closet.openModal = (costume) => {
      //Send the entire costume object and user object into modal.
      const modalInstance = $uibModal.open({
        size: "lg",
        templateUrl: "/partials/detail.html", 
        controller: "Detail",
        controllerAs: "detail", 
        resolve: {
          "costume": costume, 
          "user": closet.user
        }
      });
    };

  }]);
