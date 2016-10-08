app.factory( "CostumeFactory", [ 
  "$http", 
  "apiUrl",
  "APIFactory", 
  function($http, apiUrl, APIFactory) {

    const errorHandle = (e) => {console.log(e);};


    return {

      getPublicCostumes: () => {
        // Gets all public costumes for feed.
        // Arguments: none
        return APIFactory.getApiRoot()
        .then((root) => {
          return $http.get(`${root.costumes}?public=true`);
        }, errorHandle)
        .then((res) => {
          return res.data;
        }, errorHandle);
      }, 

      getUserCostumes: (userid) => {
        // Get all costumes owned by a given user. 
        // Argument: user id
        return APIFactory.getApiRoot()
        .then((root) => {
          return $http.get(`${root.costumes}?owner=${userid}`);
        }, errorHandle)
        .then((res) => {
          return res.data[0];
        });
      }

    };
  }]);
