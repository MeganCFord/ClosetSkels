app.controller("Detail",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$location",
  "$rootScope", // need this because the  uib-Modal scope is not actually nested inside this scope- it's randomly off to one corner or whatever.
  "$routeParams", 
  function($scope, APIFactory, $timeout, $location, $rootScope, $routeParams) {
    const detail = this;

    detail.costume = {};

    //On load, set costume from route params.
    APIFactory.getOneCostume($routeParams.costumename)
    .then((res) => {
      detail.costume = res.data;
      $timeout();
      console.log("costume gotten", detail.costume);
    }, e => console.error);

    // On load, also load all tags.
    APIFactory.getTags()
    .then((res)=> {
      detail.tags = res; 
      $timeout();
    }, e => console.error);
  
  }]);
