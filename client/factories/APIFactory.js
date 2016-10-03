app.factory( "APIFactory", [ 
  "$http", 
  "apiUrl", 
  function($http, apiUrl) {

    const httpGet = $http.get(apiUrl);

    const errorHandle = (e) => {console.log(e);};


    return {
  
      getApiRoot: () => {
        return httpGet.then(res => res.data);
      },
      //// USERS ////
      getUser: (username) => {
        // TODO: change this to the user ID? 
        return getApiRoot().then((root) => {
          return $http.get(`${root.users}?username=${username}`);
        }, errorHandle)
        .then((res) => {
          return res.data;
        }, errorHandle);
      },

      getUserInfo: (username) => {
        return getUser(username)
        .then((res) => {
          return res[0];
        }, errorHandle);
      },

      //// BOOS ////
      
      getUserBoos: (id) => {
        // TODO: move this into costumes?
        return getApiRoot()
        .then((root)=> {
          return $http.get(`${root.boos}?userid=${id}`);
        }, errorHandle)
        .then((res) => {
          return res.data;
        });
      },
      addBoo: (userUrl, costumeUrl) => {
        return getApiRoot()
        .then((root)=> {
          return $http.post(`${root.boos}`, {"owner": userUrl, "costume": costumeUrl});
        }, errorHandle)
        .then((res) => res.data, errorHandle);
      }, 
      deleteBoo: (booUrl) => {
        return $http.delete(`${booUrl}`)
        .then(()=> true, errorHandle);
      },

      //// TAGS ////
  
      getTags: () => {
        return getApiRoot()
        .then((root) => {
          return $http.get(`${root.tags}`);
        }, errorHandle)
        .then((res)=> {
          return res.data;
        }, errorHandle);
      },
      createTag: (data) => {
        return getApiRoot()
        .then((root) => {
          return $http.post(`${root.tags}`, data);
        }, errorHandle)
        .then((res) => res.data);
      }, 


      //// ELEMENTS ////
    
      getElements: () => {
        return getApiRoot()
        .then((root) => {
          return $http.get(`${root.elements}`);
        }, errorHandle)
        .then((res)=> {
          return res.data;
        }, errorHandle);
      },
      createElement: (data) => {
        return getApiRoot()
        .then((root) => {
          return $http.post(`${root.elements}`, data);
        }, errorHandle)
        .then((res)=> res.data);
      }, 

      //// COSTUMES ////

      getCostumes: () => {
        // Gets all public costumes for feed.
        return getApiRoot()
        .then((root) => {
          return $http.get(`${root.costumes}?public=true`);
        }, errorHandle)
        .then((res) => {
          return res.data;
        }, errorHandle);
      }, 
      getOneCostume: (id) => {
        // Gets one costume for editing.
        return getApiRoot()
        .then((root) => {
          return $http.get(`${root.costumes}?costumeid=${id}`);
        }, errorHandle)
        .then((res)=> {
          return res.data[0];
        }, errorHandle);
      },
      createCostume: (data) => {
        return getApiRoot()
        .then((root) => {
          return $http.post(`${root.costumes}`, data);
        }, errorHandle)
        .then(()=> true, errorHandle);
      },
      updateCostume: (data) => {
        return $http.put(`${data.url}`, data)
        .then((res) => {
          return res.data;
        }, errorHandle);
      }, 

      //// SUPPLIES ////

      createSupply: (data) => {
        // TODO: make this actually return what I want.
        return getApiRoot()
        .then((root) => {
          return $http.post(`${root.supplies}`, data);
        }, errorHandle)
        .then((res) => {
          return res.data[0];
        });     
      }, 
      getSupplies: (costume=null) => {
        // Gets the supplies either for an uncreated costume, or for the selected costume. This is not scaleable: TODO: make supplies attached to a user.
        return getApiRoot()
        .then((root) => {
          if (costume===null) {
            return $http.get(`${root.supplies}`);
          } else {
            return $http.get(`${root.supplies}?costume=${costume}`);
          }
        }, errorHandle)
        .then((res)=> res.data);
      }, 

      editSupply: (data) => {
        // TODO: fix this. 
        return $http.put(`${data.url}`, data)
        .then((res) => {
          return res.data;
        }, errorHandle);
      }, 

      ///// DELETIONS /////
  
      deleteSomething: (url) => {
        return $http.delete(`${url}`);
      }
    }; 


  }]);
