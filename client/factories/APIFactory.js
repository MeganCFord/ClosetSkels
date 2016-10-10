app.factory( "APIFactory", [ 
  "$http", 
  "apiUrl", 
  function($http, apiUrl) {

    const httpGet = $http.get(apiUrl);
    
    const errorHandle = (e) => {console.log(e);};

    const getApiRoot = () => {
      return httpGet.then(res => res.data);
    };

    return {

      //// BOOS ////
      
      getUserBoos: (userid) => {
        // Get all costumes 'bood' (liked) by a given user, via boo database table.
        // Argument: user id
        return getApiRoot()
        .then((root)=> {
          return $http.get(`${root.boos}?userid=${userid}`);
        }, errorHandle)
        .then((res) => {
          return res.data;
        });
      },  
      createBoo: (userUrl, costumeUrl) => {
        // Add a new 'boo'. 
        // Arguments: URL of current user, URL of costume clicked. 
        return getApiRoot()
        .then((root)=> {
          return $http.post(`${root.boos}`, {"owner": userUrl, "costume": costumeUrl});
        }, errorHandle)
        .then((res) => res.data, errorHandle);
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
        .then((res)=> {
          return res.data;
        }, errorHandle);
      }, 

      //// SUPPLIES ////

      getSupplies: (costumeid=null) => {
        // Gets the supplies either for an uncreated costume, or for the selected costume. TODO: make supplies attached to a user so multiple users can be creating costumes/have created supplies at once.
        return getApiRoot()
        .then((root) => {
          if (costumeid===null) {
            return $http.get(`${root.supplies}`);
          } else {
            return $http.get(`${root.supplies}?costumeid=${costumeid}`);
          }
        }, errorHandle)
        .then((res)=> res.data);
      }, 

      createSupply: (data) => {
        // TODO: make this actually return what I want.
        return getApiRoot()
        .then((root) => {
          return $http.post(`${root.supplies}`, data);
        }, errorHandle)
        .then((res) => {
          return res.data;
        });     
      }, 

      editSupply: (data) => {
        // TODO: fix this. 
        return $http.put(`${data.url}`, data)
        .then((res) => {
          return res.data;
        }, errorHandle);
      }, 

      ///// UTILITIES /////
      
      getApiRoot: getApiRoot,
  
      deleteSomething: (url) => {
        return $http.delete(`${url}`);
      }, 

      getSomething: (url) => {
        return $http.get(`${url}`)
        .then((res)=> {
          return res.data;
        });
      }

    };
  }]);
