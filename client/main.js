const app = angular.module("Halloween", ["ngRoute", "ngCookies"]);

app.constant("apiUrl", "http://localhost:8000");

// on page load, get cookie if it exists and set credentials/permissions.
app.run(function run(AuthFactory, $cookies, $http) {
  const hc= $cookies.get("HalloweenCredentials");
  if (hc) {
    AuthFactory.decodeCredentials(hc);
    $http.defaults.headers.common.Authorization = "Basic " + AuthFactory.getEncodedCredentials();
  }
});


app.config(function($routeProvider) {
  $routeProvider
    .when("/login", {
      templateUrl: "partials/login.html",
      controller: "Login",
      controllerAs: "login"
    })
    .when("/home", {
      templateUrl: "partials/home.html", 
      controller: "Home", 
      controllerAs: "home"
    })
    .when("/likes", {
      templateUrl: "partials/likes.html", 
      controller: "Likes", 
      controllerAs: "likes"
    })
    .when("/closet", {
      templateUrl: "partials/closet.html", 
      controller: "Closet", 
      controllerAs: "closet"
    })
    .when("/create", {
      templateUrl: "partials/create.html", 
      controller: "Create", 
      controllerAs: "create"
    })
    .when("/search", {
      templateUrl: "partials/search.html", 
      controller: "Search", 
      controllerAs: "search"
    })
    .otherwise("/login");
});
