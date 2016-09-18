app.factory( "APIFactory", [ 
  "$http", 
  "apiUrl", 
  function($http, apiUrl) {

    const httpGet = $http.get(apiUrl);

    const getApiRoot = () => {
      return httpGet.then(res => res.data);
    };

    return {
      getCostumes: () => {
        return getApiRoot()
        .then((root) => {
          return $http.get(`${root.costumes}`);
        }, (e) => console.log(e))
        .then((res) => {
          return res.data;
        }, (e) => console.log(e));
      }, 
      getUserCostumes: (username) => {
        return getApiRoot()
          .then((root) => {
            return $http.get(`${root.users}?username=${username}`);
          }, (e) => console.log(e))
          .then((res) => {
            console.log("should have user costumes here", res.data);
            return res.data;
          }, (e) => console.log(e));
      }
    };  
  }]);
