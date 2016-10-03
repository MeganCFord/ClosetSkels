app.factory( "CostumeFactory", [ 
  "$http", 
  "apiUrl",
  "APIFactory", 
  function($http, apiUrl, APIFactory) {

    const errorHandle = (e) => {console.log(e);};


    return {
      getUserCostumes: (username) => {
        // returns list of 
        return APIFactory.getApiRoot()
        .then((root) => {
          return $http.get(`${root.costumes}?owner=${username}`);
        }, errorHandle)
        .then((res) => {
          console.log(res.data);
          return res.data[0];
        });
      }
    };


  }]);
