app.factory( "CostumeFactory", [ 
  "$http", 
  "apiUrl",
  "APIFactory", 
  function($http, apiUrl, APIFactory) {

    const errorHandle = (e) => {console.log(e);};


    return {
      getUserCostumes: (username) => {
        // TODO: change this to get from the user id? Do I need to edit the cookies?
        return APIFactory.getApiRoot()
        .then((root) => {
          return $http.get(`${root.costumes}?owner=${username}`);
        }, errorHandle)
        .then((res) => {
          console.log(res.data);
          return res.data[0];
        });
      },

      getUserBoos: (username) => {
        return APIFactory.getApiRoot()
        .then((root)=> {
          return $http.get(`${root.boos}?username=${username}`);
        }, errorHandle)
        .then((res) => {
          return res.data;
        });
      }
    };


  }]);
