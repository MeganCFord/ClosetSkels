app.controller("Detail",[
  "$scope",
  "APIFactory",
  "CostumeFactory",
  "$timeout",
  "$location",
  "$uibModalInstance",
  "costume", // Sent in from modal-open resolve.
  "user", // Sent in from modal-open resolve.
  function($scope, APIFactory, CostumeFactory, $timeout, $location, $uibModalInstance, costume, user) {
    const detail = this;

    detail.costume = costume;
    detail.user = user;

    APIFactory.getSupplies(detail.costume.id)
    .then((res)=> {
      detail.supplies = res;
      $timeout();
    }, e => console.error);

    
    // BOO FUNCTIONALITY //

    detail.boo = () => {
      // Create new boo.
      APIFactory.createBoo(detail.user.url, detail.costume.url)
      .then((res) => {
        // Add created boo to list of costume boos.
        detail.costume.boos.push(res);
        $timeout();
      }, e=>console.error);
    };

    detail.unBoo = (boo) => {
      // Splice boo out of local costume copy.
      detail.costume.boos.splice(detail.costume.boos.indexOf(boo), 1);
      // Remove boo via url.
      APIFactory.deleteSomething(boo.url);
      $scope.$emit("unboo", detail.costume);
      $uibModalInstance.close();
    };


    detail.copyToCloset = () => {
      // Edit existing costume object 
      delete detail.costume["url"];
      delete detail.costume["id"];
      detail.costume.owner = detail.user.url;
      detail.costume.public = false;
      // Create a new costume using most of existing info.
      CostumeFactory.copyCostume(detail.costume, detail.supplies)
      .then(() => {
        // Redirect to costume closet page.
        $location.path("/closet");
        $uibModalInstance.close();
      }, e=>console.error);
    };

    detail.goToEdit = () => {
      // redirect to edit page.
      $location.path(`/edit/${detail.costume.id}`);
      $uibModalInstance.close();
    };
  
    detail.cancel = function () {
      // Close the modal, doing nothing.
      $uibModalInstance.dismiss("cancel");
    };
  }]);

