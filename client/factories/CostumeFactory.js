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
          return $http.get(`${root.costumes}?userid=${userid}`);
        }, errorHandle)
        .then((res) => {
          return res.data;
        });
      },

      getOneCostume: (id) => {
        // Gets one costume via id, for editing.
        return APIFactory.getApiRoot()
        .then((root) => {
          return $http.get(`${root.costumes}?costumeid=${id}`);
        }, errorHandle)
        .then((res)=> {
          return res.data[0];
        }, errorHandle);
      }, 

      createNewCostume: (costume, supplies) => {
        return APIFactory.getApiRoot()
        .then((root) => {
          return $http.post(`${root.costumes}`, costume);
        }, errorHandle)
        .then((res) => {
          supplies.forEach((supply)=> {
          // if the costume is brand new, simply update the created null-costume supplies with the new costume instance on the costume field.
            supply.costume = String(res.data.url);
            return APIFactory.editSupply(supply)
            .then((res) => {
            console.log("should have made a supply here", res);
            }, errorHandle);
          });
        });
      },
      updateCostume: (costume) => {
        return $http.put(`${costume.url}`, costume)
        .then((res) => {
          return res.data;
        }, errorHandle);
      }, 
      
      copyCostume: (costume, supplies) => {
        return APIFactory.getApiRoot()
        .then((root)=> {
          return $http.post(`${root.costumes}`, costume);
        }, errorHandle)
        .then((res)=> {
          supplies.forEach((supply)=> {
            // Since we're copying an existing costume, also copy all the existing supplies as new ones with the new costume URL.
            supply.costume = String(res.data.url);
            return APIFactory.createSupply(supply)
            .then((res)=> {
              console.log("supply copy created", res);
            }, errorHandle);
          });
        });
      }

    };
  }]);

