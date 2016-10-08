app.controller("Likes",[
  "$scope",
  "$timeout",
  "APIFactory",
  "CostumeFactory",
  "$http",
  "$uibModal",
  "$location", 
  function($scope, $timeout, APIFactory, CostumeFactory, $http, $uibModal, $location) {
    const likes = this;
    likes.title="likes page";

    // likes.boos = [];
    likes.boodCostumes = [];
    likes.search = "";
    
    $scope.$on("user", function(event, data) {
      $timeout().then(()=> {
        // Save User data.
        likes.user = data;
        $timeout(); 
        return data;
      }).then(() => {
        // Get all the boos owned by the user.
        return APIFactory.getUserBoos(likes.user.id);
      }).then((res) => {
        console.log("hey here are the boos", res);
        likes.boos = res;
      });
    });

   
    //   }, e=> console.error)
    //   .then((boos) => {
    //     const booPromises = boos.map((magic) => {
    //       if(magic.costume != undefined) {
    //         return $http.get(magic.costume).then((res) => {
    //           likes.boodCostumes.push(res.data);
    //           $timeout();
    //           console.log("bood costumes", likes.boodCostumes);
    //         }, e=> console.error);
    //       }
    //     });
    //   }, e=> console.error);
    // });

    likes.unBoo = (boourl) => {
      console.log("unbooing", boourl);
      return $http.delete(boourl)
      .then(()=> {
        for (const index in likes.boos) {
          if (likes.boos[index].url ===boourl) {
            likes.boos.splice(index, 1);
            console.log("new bood costumes", likes.boos);
          }
        }
        $timeout();
      }, e=> console.error);
    };

    likes.openModal = (costume) => {
    //Sending the entire object into modal.
      const modalInstance = $uibModal.open({
        size: "lg",
        templateUrl: "/partials/detail.html", 
        controller: "Detail",
        controllerAs: "detail", 
        resolve: {
          "costume": costume, 
          "userInfo": likes.userInfo
        }
      });
    };

    likes.saveToCloset = (costume) => {
      const costumeToSave = costume;
      delete costumeToSave["url"];
      delete costumeToSave["id"];
      if(costumeToSave["$$hashKey"]) {
        delete costumeToSave["$$hashKey"];
      }
      costumeToSave.owner = likes.userInfo.url;
      costumeToSave.public = false;

      APIFactory.createCostume(costumeToSave)
      .then(() => {
        $location.path("/closet");
      }, e=>console.error);
    };
  }]);

