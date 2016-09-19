app.factory( "APIFactory", [ 
  "$http", 
  "apiUrl", 
  function($http, apiUrl) {

    const httpGet = $http.get(apiUrl);

    const getApiRoot = () => {
      return httpGet.then(res => res.data);
    };

    const errorHandle = (e) => {console.log(e);};

    const getUser = (username) => {
      return getApiRoot().then((root) => {
        return $http.get(`${root.users}?username=${username}`);
      }, errorHandle)
      .then((res) => {
        return res.data;
      }, errorHandle);
    };

    return {
  
      //// USERS ////

      getUserUrl: (username) => {
        return getUser(username)
        .then((res) => {
          return res[0].url;
        }, errorHandle);
      },
      getUserCostumes: (username) => {
        return getUser(username)
        .then((res) => {
          // returns in a list since queries return filtered lists. in this case, there will be just one match since Django requires unique usernames in its User model.
          return res[0].costumes;
        }, errorHandle);
      },

      //// BOOS ////
  
      addBoo: (userUrl, costumeUrl) => {
        return getApiRoot()
        .then((root)=> {
          return $http.post(`${root.boos}`, {"owner": userUrl, "costume": costumeUrl});
        }, errorHandle)
        .then(() => true, errorHandle);
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
        }, errorHandle);
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
        }, errorHandle);
      }, 

      //// COSTUMES ////

      getCostumes: () => {
        return getApiRoot()
        .then((root) => {
          return $http.get(`${root.costumes}`);
        }, errorHandle)
        .then((res) => {
          return res.data;
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
        console.log(data);
      }, 
      deleteCostume: (costumeurl) => {
        return $http.delete(`${costumeurl}`)
        .then(() => true, errorHandle);
      } 
    }; 
  }]);
