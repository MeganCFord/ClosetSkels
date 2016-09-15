const app = angular.module("Halloween", ["ngRoute"]);

app.config(function($routeProvider, $httpProvider) {
  $httpProvider.defaults.xsrfCookieName = "csrftoken";
  $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";

  $routeProvider
    .when("/", {
      templateUrl: "partials/main.html",
      controller: "Main",
      controllerAs: "main"
    })
    .otherwise("/");
});

app.controller("Main", ["$scope", "$timeout", function($scope) {

  const main = this;

  main.title="hello world.";

}]);
