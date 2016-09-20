app.controller("Likes",[
  "$scope",
  "$timeout",
  "APIFactory",
  function($scope, $timeout, APIFactory) {
    const likes = this;
    likes.title="likes page";
    
    $scope.$on("username", function(event, data) {
      $timeout().then(()=> {
        likes.username = data;
        $timeout();
        return data;
      }).then((data)=> {
        console.log("sending username to get info", data);
        return APIFactory.getUserInfo(data);
      }).then((res)=> {
        likes.userInfo = res;
        $timeout();
        console.log("user info set", likes.userInfo);
      }, e => console.error)
      .then((res)=> {
        return APIFactory.getUserBoos(likes.userInfo.id);
      }).then((res)=> {
        console.log("user boos", res);
        likes.boos = res;
        $timeout();
      }, e=> console.error);
    });

  }]);
