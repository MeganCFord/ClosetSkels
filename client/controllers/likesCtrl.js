app.controller("Likes",[
  "$scope",
  "$timeout",
  "APIFactory",
  "$http",
  "$uibModal",
  function($scope, $timeout, APIFactory, $http, $uibModal) {
    const likes = this;
    likes.title="likes page";

    likes.boos = [];
    likes.boodCostumes = [];
    
    $scope.$on("username", function(event, data) {
      $timeout().then(()=> {
        likes.username = data;
        $timeout();
        return data;
      }).then((data)=> {
        return APIFactory.getUserInfo(data);
      }).then((res)=> {
        likes.userInfo = res;
        $timeout();
      }, e => console.error)
      .then((res)=> {
        return APIFactory.getUserBoos(likes.userInfo.id);
      }).then((res)=> {
        console.log("user boos", res);
        likes.boos = res;
        $timeout();
        return res;
      }, e=> console.error)
      .then((boos) => {
        const booPromises = boos.map((magic) => {
          return $http.get(magic.costume).then((res) => {
            likes.boodCostumes.push(res.data);
            $timeout();
            console.log("bood costumes", likes.boodCostumes);
          }, e=> console.error);
        });
      }, e=> console.error);
    });

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
          "costume": costume
        }
      });
    };
  }]);

