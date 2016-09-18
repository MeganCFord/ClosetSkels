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
            // returns in a list since queries return filtered lists. in this case, there will be just one match since Django requires unique usernames in its User model.
            console.log("should have user costumes here", res.data[0].costumes);
            return res.data[0].costumes;
          }, (e) => console.log(e));
      }
    };  
  }]);
