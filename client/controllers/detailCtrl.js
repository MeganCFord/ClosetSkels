app.controller("Detail",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$location",
  "$routeParams", 
  function($scope, APIFactory, $timeout, $location, $routeParams) {
    const detail = this;

    detail.costume = {};
    detail.supplies = [];
    detail.userInfo = {};
    detail.userBoo = false;

    // Get the costume info.
    APIFactory.getOneCostume($routeParams.id)
    .then((res) => {
      detail.costume = res;
      $timeout();
    }, e => console.error)
    .then(()=> {
      // Query for just the supplies that belong to this costume.
      return APIFactory.getCostumeElements(detail.costume.id);
    }).then((res)=> {
      detail.supplies = res;
      $timeout();
    }, e => console.error);

    // Get the user URL for boo'ing.
    $scope.$on("username", function(event, data) {
      $timeout().then(() => {
        return APIFactory.getUserInfo(data);
      }).then((res) => {
        detail.userInfo = res; 
        $timeout();
      }, e=> console.error)
      .then(() => {
        // Set user boo variable.
        for (const index in detail.costume.boos) {
          // two equals signs here because the userInfo url is an expression not a string.
          if (detail.costume.boos[index].owner == detail.userInfo.url) {
            detail.userBoo = true;
            break;
          }
        }
      });
    });

    
    // Boo functionality

    detail.boo = () => {
      APIFactory.addBoo(detail.userInfo.url, detail.costume.url)
      .then((res) => {
        detail.costume.boos.push(res);
        detail.userBoo = true;
        $timeout();
      }, e=>console.error);
    };

    detail.unBoo = () => {
      let boourl = "";
      for(const index in detail.costume.boos) {
        if (detail.costume.boos[index].owner == detail.userInfo.url) {
          boourl = detail.costume.boos[index].url;
          detail.costume.boos.splice(index, 1);
        }
      }
      APIFactory.deleteBoo(boourl)
      .then(() => {
        detail.userBoo = false;
        $timeout();
      }, e=>console.error);
    };

    detail.copyToCloset = () => {
      delete detail.costume["url"];
      delete detail.costume["id"];
      detail.costume.owner = detail.userInfo.url;
      detail.costume.public = false;
      console.log("costume I'm sending", detail.costume);

      APIFactory.createCostume(detail.costume)
      .then((res) => {
        console.log("new costume", res);
        $location.path("/closet");
      }, e=>console.error);

    };
  
  }]);

