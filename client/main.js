const app = angular.module("Halloween", ["ngRoute", "ngCookies", "ui.bootstrap"]);

app.constant('apiUrl', "http://localhost:8000");



// THIS STUFF DOES NOT WORK for some reason.
app.config(($httpProvider) => {
  // const csrfToken = Cookies.get('csrftoken')
  $httpProvider.defaults.headers.xsrfCookieName = 'csrfToken';
  $httpProvider.defaults.headers.xsrfHeaderName = 'X-CSRFToken';
});

app.run(function run($http, $cookies) {
//   // For CSRF token compatibility with Django
  $http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
});

app.config($routeProvider => {
  $routeProvider
    .when("/", {
      templateUrl: "partials/login.html",
      controller: "Login",
      controllerAs: "login"
    })
    .when("/home", {
      templateUrl: "partials/home.html", 
      controller: "Home", 
      controllerAs: "home"
    })
    .otherwise("/");
});



