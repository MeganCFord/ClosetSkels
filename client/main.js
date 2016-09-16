const app = angular.module("Halloween", ["ngRoute", "ngCookies"]);

app.constant('apiUrl', "http://localhost:8000");




app.config(($httpProvider) => {
  // const csrfToken = Cookies.get('csrftoken')
  $httpProvider.defaults.headers.xsrfCookieName = 'csrfToken';
  $httpProvider.defaults.headers.xsrfHeaderName = 'X-CSRFToken';
});

app.run(function run($http, $cookies) {
//   // For CSRF token compatibility with Django
  $http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
});

app.config($routeProvider => {
  $routeProvider
    .when("/", {
      templateUrl: "partials/login.html",
      controller: "Login",
      controllerAs: "login"
    })
    .when("/main", {
      templateUrl: "partials/main.html", 
      controller: "Home", 
      controllerAs: "home"
    })
    .otherwise("/");
});



