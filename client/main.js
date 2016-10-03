const app = angular.module("Halloween", ["ngRoute", "ngAnimate", "ngCookies", "angular.filter", "ui.bootstrap"]);

app.constant("apiUrl", "http://localhost:8000");


// on page load, get authorization cookie from browser if it exists-
app.run(function run(UserFactory, $cookies, $http, $location) {
  const hc = $cookies.get("HalloweenCredentials");
  if (hc) {
    // Set http credentials for permissions.
    $http.defaults.headers.common.Authorization = "Basic " + hc;
    // Save encoded creds into user factory.
    UserFactory.setEncodedCredentials(hc);
  } else {
    // If the cookie doesn't exist, send the user to the login page.
    $location.path("/login");
  }
});



app.config(function($routeProvider) {
  $routeProvider
    .when("/login", {
      templateUrl: "partials/login.html",
      controller: "Login",
      controllerAs: "login"
    })
    .when("/register", {
      templateUrl: "partials/register.html",
      controller: "Login",
      controllerAs: "login"
    })
    .when("/home", {
      templateUrl: "partials/home.html", 
      controller: "Home", 
      controllerAs: "home"
    })
    .when("/boos", {
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
    .when("/edit/:id", {
      templateUrl: "partials/create.html", 
      controller: "Edit", //TODO: make the create and edit controllers the same.
      controllerAs: "create"
    })
    .otherwise("/login");
});
