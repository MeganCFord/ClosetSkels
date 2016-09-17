app.controller("Home",[
  "$scope",
  "APIFactory",
  "$timeout",
  function($scope, APIFactory, $timeout) {
    const home = this;
    home.title="home page";
    home.costumes = {};
    
    $scope.$on("username", function(event, data) {
      home.username = data;
    });

    // load costumes to repeat through.
    APIFactory.getCostumes()
    .then((res) => {
      home.costumes = res;
      $timeout();
    }, (e) => console.log(e));

  }]);
